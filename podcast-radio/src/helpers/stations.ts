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

/**
 * Load up all the radio stations.
 */
export const loadStations = async (): Promise<Config> => {
  // TODO - Fetch files + split out files
  const res = await import("../assets/stations.json");

  return {
    stations: res.stations,
  };
};
