import { z } from "zod";
import yaml from "js-yaml";
import { join } from "node:path";
import { readdir, lstat, readFile } from "node:fs/promises";

/**
 * Config source for a radio station.
 */
export interface Station {
  title: string;
  combineBy: // Concat each podcast's list of episodes, in the order they're listed
  | "as-is"
    // Completely random
    | "shuffle"
    // Try to alternate between episodes, but we might need to chunk them
    | "interleave";
  feeds: string[];
}

/**
 * A single episode of a podcast.
 */
export interface Episode {
  title: string;
  link?: string;
  url: string;
  durationSeconds: number;
  podcastTitle: string;
  podcastLink?: string;
}

/**
 * Everything from a given station.
 */
export interface StationContents {
  title: string;
  episodes: Episode[];
}

/**
 * Everything precalculated, to be loaded later.
 */
export interface Config {
  stations: StationContents[];
}

const stationSchema: z.Schema<Station> = z.object({
  title: z.string(),
  combineBy: z.enum(["as-is", "shuffle", "interleave"]),
  feeds: z.array(z.string()),
});

/**
 * Find and validate all of the station config files.
 */
export async function* loadStations(
  stationsDirectory: string,
): AsyncGenerator<Station> {
  for (const name of await readdir(stationsDirectory)) {
    const configFilePath = join(stationsDirectory, name);
    const stats = await lstat(configFilePath);
    if (!stats.isFile()) {
      continue;
    }

    const configFile = await readFile(configFilePath, "utf-8");
    yield stationSchema.parse(yaml.load(configFile));
  }
}
