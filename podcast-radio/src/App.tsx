import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { CircularProgress } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import ToggleButton from "@mui/material/ToggleButton";
import { useEffect, useState } from "react";
import CurrentEpisode from "./components/current-episode.tsx";
import Player from "./components/player.tsx";
import StationPicker from "./components/station-picker.tsx";
import UpNext from "./components/up-next.tsx";
import { generateStationFeed, loadStations } from "./helpers/stations.ts";
import { getCurrent } from "./helpers/timing.ts";
import type { Config, StationConfig } from "./stations.ts";

function App() {
  const now = Date.now();

  const [config, setConfig] = useState<Config | undefined>();
  const [currentStation, setCurrentStation] = useState<
    StationConfig | undefined
  >();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startAtSeconds, setStartAtSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!config) {
      loadStations()
        .then((config) => setConfig(config))
        .catch((error) => console.error(error));
    }
  }, []);

  if (!config) {
    return (
      <Container maxWidth="sm">
        <CircularProgress />
      </Container>
    );
  }

  const { stations } = config;

  if (stations.length === 0) {
    return null;
  }

  const stationFeed = currentStation
    ? generateStationFeed(config, currentStation.title)
    : undefined;

  return (
    <Container maxWidth="lg">
      <Grid container spacing="1rem">
        <Grid size={12}>
          <ToggleButton
            color="success"
            value="check"
            selected={playing}
            onChange={() => {
              setPlaying((prevSelected) => !prevSelected);

              if (!currentStation) {
                setCurrentStation(stations[0]);
              }

              const { episodeIndex, timeOffsetSeconds } = getCurrent(
                stationFeed ?? generateStationFeed(config, stations[0].title),
                new Date(0),
                new Date(),
              );

              setCurrentTrack(episodeIndex);
              setStartAtSeconds(timeOffsetSeconds);
            }}
          >
            <PowerSettingsNewIcon />
          </ToggleButton>
        </Grid>

        <Grid
          size={{
            md: 3,
            sm: 12,
          }}
        >
          <StationPicker
            stations={stations}
            value={currentStation}
            onChange={(station) => {
              setCurrentStation(station);
              const { episodeIndex, timeOffsetSeconds } = getCurrent(
                generateStationFeed(config, station.title),
                new Date(0),
                new Date(),
              );
              setCurrentTrack(episodeIndex);
              setStartAtSeconds(timeOffsetSeconds);
              setPlaying(true);
            }}
          />
        </Grid>

        <Grid
          size={{
            md: 9,
            sm: 12,
          }}
        >
          {stationFeed ? (
            <>
              <CurrentEpisode
                currentTimestamp={now}
                currentProgress={currentTime}
                episode={stationFeed.episodes[currentTrack]}
              />

              <UpNext episode={stationFeed.episodes[currentTrack + 1]} />

              <Player
                playing={playing}
                source={stationFeed.episodes[currentTrack].url}
                startAtSeconds={startAtSeconds}
                onTimeUpdate={({ currentTime }) => setCurrentTime(currentTime)}
                onComplete={() => {
                  const trackIndex = currentTrack + 1;
                  setCurrentTrack(trackIndex);
                }}
              />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
