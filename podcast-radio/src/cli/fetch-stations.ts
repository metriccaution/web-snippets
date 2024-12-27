import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Config, Episode, StationConfig } from "../stations.ts";
import { parseFeed } from "./lib/parser.ts";
import { loadStations } from "./lib/stations.ts";

const cwd = dirname(fileURLToPath(import.meta.url));

const data: Config = {
  rssFeeds: [],
  stations: [],
};

for await (const station of loadStations(join(cwd, "stations"))) {
  console.log(station.title);

  const stationData: StationConfig = {
    title: station.title,
    combineBy: station.combineBy,
    rssFeeds: [],
  };

  data.stations.push(stationData);

  for (const url of station.feeds) {
    console.log("\t" + url);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(url);
    }

    const text = await res.text();

    const podcast = parseFeed(text);
    stationData.rssFeeds.push(podcast.title);

    data.rssFeeds.push({
      title: podcast.title,
      episodes: podcast.episodes
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
        .filter((e) => e.durationSeconds > 0),
    });
  }
}

await writeFile(
  join(cwd, "..", "assets", "stations.json"),
  JSON.stringify(data),
  "utf-8",
);
