import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { FC } from "react";
import { Episode } from "../helpers/stations";
import TimeDisplay from "./time-display";

export interface CurrentEpisodeProps {
  episode: Episode;
  currentProgress: number;
  currentTimestamp: number;
}

/**
 * Show info about the current episode.
 */
const CurrentEpisode: FC<CurrentEpisodeProps> = ({
  episode,
  currentProgress,
  currentTimestamp,
}) => {
  const percentage = currentProgress / episode.durationSeconds;
  const progress = Number.isNaN(percentage) ? 0 : Math.floor(100 * percentage);

  // TODO - This wanders a few millis, and might be distracting if its close enough to the minute crossover
  const estimatedStart = new Date(currentTimestamp - currentProgress * 1000);

  const remainingSeconds = Math.max(
    episode.durationSeconds - currentProgress,
    0,
  );
  const estimatedEnd = new Date(currentTimestamp + remainingSeconds * 1000);

  const episodeTitle = episode.link ? (
    <Link target="_blank" href={episode.link}>
      {episode.title}
    </Link>
  ) : (
    episode.title
  );
  const podcastTitle = episode.podcastLink ? (
    <Link target="_blank" href={episode.podcastLink}>
      {episode.podcastTitle}
    </Link>
  ) : (
    episode.podcastTitle
  );

  return (
    <>
      <Typography component="h1" variant="h5">
        {episodeTitle}
      </Typography>

      <Typography>
        <TimeDisplay label="Start" date={estimatedStart} />
        <TimeDisplay label="End" date={estimatedEnd} />
      </Typography>
      <Typography>From {podcastTitle}</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </>
  );
};

export default CurrentEpisode;
