import { z } from "zod";
import { parse } from "@libs/xml";
import { isNotNil } from "es-toolkit";
import dayjs from "dayjs";
import dateParse from "dayjs/plugin/customParseFormat";
dayjs.extend(dateParse);

/**
 * Spec for Deno-parsed XML file.
 */
const rss = z.object({
  rss: z.object({
    channel: z.object({
      title: z.string(),
      link: z.string().optional(),
      description: z.string(),
      item: z.array(
        z.object({
          guid: z.union([
            z.object({
              "#text": z.string(),
            }),
            z.string(),
          ]),
          title: z.string(),
          link: z.string().optional(),
          pubDate: z.string(),
          "itunes:duration": z.string().optional(),
          enclosure: z
            .object({
              "@url": z.string().url(),
              "@type": z.string().optional(),
            })
            .optional(),
        }),
      ),
    }),
  }),
});

export interface PodcastFeed {
  title: string;
  link?: string;
  description: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  link?: string;
  published: Date;
  duration?: number;
  mediaType?: string;
  mediaUrl: URL;
}

/**
 * Parse an RSS feed, and get just the interesting bits out of it.
 */
export function parseFeed(feedXml: string): PodcastFeed {
  const parsed = rss.parse(parse(feedXml));

  return {
    title: parsed.rss.channel.title,
    description: parsed.rss.channel.description,
    link: parsed.rss.channel.link,
    episodes: parsed.rss.channel.item
      .map((i) =>
        i.enclosure
          ? {
              id: typeof i.guid === "string" ? i.guid : i.guid["#text"],
              title: i.title,
              link: i.link,
              duration: parseDuration(i["itunes:duration"]),
              mediaType: i.enclosure["@type"],
              mediaUrl: new URL(i.enclosure["@url"]),
              published: dayjs(
                i.pubDate.slice(4).replace("GMT", "+0000").trim(),
                "DD MMM YYYY HH:mm:ss Z",
              ).toDate(),
            }
          : undefined,
      )
      .filter(isNotNil)
      .filter((i) => !Number.isNaN(i.published.getTime()))
      .sort((a, b) => a.published.getTime() - b.published.getTime()),
  };
}

/**
 * Parse a duration string, returning the data in seconds, if possible.
 */
export function parseDuration(duration?: string): number | undefined {
  if (!duration) {
    return undefined;
  }

  if (!/^[\d(\.\d+)?:]+$/.test(duration)) {
    return undefined;
  }

  const multipliers: Record<number, number[]> = {
    1: [1],
    2: [60, 1],
    3: [3600, 60, 1],
  };

  const parts = duration.split(":").map((n) => Number.parseFloat(n));

  const multiplier = multipliers[parts.length];
  if (!multiplier) {
    return undefined;
  }

  return parts.map((n, i) => n * multiplier[i]).reduce((s, i) => s + i, 0);
}
