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
 * Static config generated by the build, loaded on UI startup.
 */
export interface Config {
  stations: StationContents[];
}
