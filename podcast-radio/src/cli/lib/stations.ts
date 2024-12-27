import yaml from "js-yaml";
import { lstat, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import type { CombinationMode } from "../../stations";

/**
 * Config source for a radio station.
 */
export interface StationSource {
  title: string;
  combineBy: CombinationMode;
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
