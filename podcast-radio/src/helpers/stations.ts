import type { Config } from "../stations";
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
