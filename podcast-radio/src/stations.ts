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
export interface FeedContents {
  title: string;
  episodes: Episode[];
}

/**
 * How a station combines RSS episodes
 */
export type CombinationMode =
  | "as-is" // Concat each podcast's list of episodes, in the order they're listed
  | "shuffle" // Completely random
  | "interleave"; // Alternate evenly beteen each feed

/**
 * Combine multiple RSS feeds into a single radio station
 */
export interface StationConfig {
  title: string;
  combineBy: CombinationMode;
  /**
   * Feed titles
   */
  rssFeeds: string[];
}

/**
 * Static config generated by the build, loaded on UI startup.
 */
export interface Config {
  stations: StationConfig[];
  rssFeeds: FeedContents[];
}
