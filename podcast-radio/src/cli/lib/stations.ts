import yaml from "js-yaml";
import { lstat, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

/**
 * Config source for a radio station.
 */
export interface StationSource {
  title: string;
  combineBy: // Concat each podcast's list of episodes, in the order they're listed
  | "as-is"
    // Completely random
    | "shuffle"
    // Try to alternate between episodes, but we might need to chunk them
    | "interleave";
  feeds: string[];
}

const stationSchema: z.Schema<StationSource> = z.object({
  title: z.string(),
  combineBy: z.enum(["as-is", "shuffle", "interleave"]),
  feeds: z.array(z.string()),
});

/**
 * Find and validate all of the station config files.
 */
export async function* loadStations(
  stationsDirectory: string,
): AsyncGenerator<StationSource> {
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
