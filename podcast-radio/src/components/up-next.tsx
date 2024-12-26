import Typography from "@mui/material/Typography";
import { FC } from "react";
import { Episode } from "../helpers/stations";

export interface CurrentEpisodeProps {
  episode: Episode;
}

/**
 * What's coming next.
 */
const UpNext: FC<CurrentEpisodeProps> = ({ episode }) => (
  <Typography>Up next - {episode.podcastTitle}</Typography>
);

export default UpNext;
