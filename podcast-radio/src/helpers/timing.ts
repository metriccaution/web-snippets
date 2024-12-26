import type { StationContents } from "../stations";

/**
 * When picking up a station, work out where we should be if it had been
 * playing on its own.
 */
export const getCurrent = (
  station: StationContents,
  startTime: Date,
  now: Date,
): { episodeIndex: number; timeOffsetSeconds: number } => {
  const totalDurationMillis = station.episodes.reduce(
    (s, i) => s + i.durationSeconds * 1000,
    0,
  );

  if (totalDurationMillis === 0) {
    throw new Error(`No duration set for ${station.title}`);
  }

  const millisElapsed = now.getTime() - startTime.getTime();
  let offsetSeconds = (millisElapsed % totalDurationMillis) / 1000;

  for (let i = 0; i < station.episodes.length; i++) {
    const episode = station.episodes[i];

    if (episode.durationSeconds > offsetSeconds) {
      // We're within this episode
      return {
        episodeIndex: i,
        timeOffsetSeconds: Math.floor(offsetSeconds),
      };
    } else {
      offsetSeconds -= episode.durationSeconds;
    }
  }

  throw new Error(`Failed to calculate time offset for ${station.title}`);
};
