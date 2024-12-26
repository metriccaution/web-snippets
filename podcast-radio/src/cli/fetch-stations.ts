import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Episode, FeedContents } from "../stations.ts";
import { combine } from "./lib/grouping.ts";
import { parseFeed } from "./lib/parser.ts";
import { loadStations } from "./lib/stations.ts";

const cwd = dirname(fileURLToPath(import.meta.url));

const data: { stations: FeedContents[] } = {
  stations: [],
};

for await (const station of loadStations(join(cwd, "stations"))) {
  console.log(station.title);
  const stationEpisodes: Episode[][] = [];

  for (const url of station.feeds) {
    console.log("\t" + url);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(url);
    }

    const text = await res.text();

    const podcast = parseFeed(text);

    const podcastEpisodes = podcast.episodes
      .map(
        (e): Episode => ({
          title: e.title,
          url: e.mediaUrl.href,
          link: e.link,
          durationSeconds: e.duration ?? 0,
          podcastTitle: podcast.title,
          podcastLink: podcast.link,
        }),
      )
      .filter((e) => e.durationSeconds > 0);
    stationEpisodes.push(podcastEpisodes);
  }

  data.stations.push({
    title: station.title,
    episodes: combine(station.combineBy, stationEpisodes),
  });
}

await writeFile(
  join(cwd, "..", "assets", "stations.json"),
  JSON.stringify(data),
  "utf-8",
);
