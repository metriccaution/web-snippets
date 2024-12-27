import { shuffle } from "es-toolkit";
import type { Config, FeedContents } from "../stations";
import { leastCommonMultiple } from "./primes";

/**
 * Load up all the radio stations.
 */
export const loadStations = async (): Promise<Config> => {
  // TODO - Fetch files + split out files
  const res = (await import("../assets/stations.json")) as Config;

  return {
    rssFeeds: res.rssFeeds,
    stations: res.stations,
  };
};

/**
 * Combine config to create a particular station's episode list.
 */
export const generateStationFeed = (
  config: Config,
  stationName: string
): FeedContents => {
  const stationConfig = config.stations.find((s) => s.title === stationName);
  if (!stationConfig) {
    // Shouldn't happen...
    return {
      title: stationName,
      episodes: [],
    };
  }

  const rssFeeds = config.rssFeeds.filter((feed) =>
    stationConfig.rssFeeds.includes(feed.title)
  );

  switch (stationConfig.combineBy) {
    case "as-is": {
      return {
        title: stationConfig.title,
        episodes: rssFeeds.flatMap((f) => f.episodes),
      };
    }
    case "shuffle": {
      return {
        title: stationConfig.title,
        episodes: shuffle(rssFeeds.flatMap((f) => f.episodes)),
      };
    }
    case "interleave": {
      return {
        title: stationName,
        episodes: produceCycle(rssFeeds.map((f) => f.episodes)),
      };
    }
    default: {
      throw new Error(
        `No handler for combination mode ${stationConfig.combineBy}`
      );
    }
  }
};

/**
 * Zip all the provided lists together, and loop around until all of them come
 * back to the start at once.
 */
export const produceCycle = <T>(lists: T[][]): T[] => {
  const cycle = cycleLength(lists.map((l) => l.length));
  console.log({ cycle });

  const combined = new Array<T>(cycle * lists.length);
  for (let i = 0; i < combined.length; i++) {
    const list = lists[i % lists.length];
    const listIndex = Math.floor(i / lists.length) % list.length;
    combined[i] = list[listIndex];
  }

  return combined;
};

/**
 * How long before repeating all feeds in a station cycles back round again.
 *
 * Introduce a maximum number of iterations, to stop things getting silly.
 */
export const cycleLength = (
  lengths: number[],
  maxIterations: number = 10
): number => {
  const actualCycle = lengths.reduce(
    (lcm, i) => leastCommonMultiple(lcm, i),
    1
  );

  // Cap how large the cycle can actually be
  const maxLength = maxIterations * lengths.reduce((m, i) => Math.max(m, i), 0);

  return Math.min(actualCycle, maxLength);
};
