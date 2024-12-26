import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FC } from "react";
import { StationContents } from "../helpers/stations";

export interface StationPickerProps {
  stations: StationContents[];
  value: StationContents | undefined;
  onChange: (station: StationContents) => void;
}

const StationPicker: FC<StationPickerProps> = ({
  stations,
  value,
  onChange,
}) => (
  <ToggleButtonGroup
    orientation="vertical"
    color="primary"
    exclusive
    value={value}
    onChange={(_e, v) => onChange(v)}
  >
    {stations.map((station) => (
      <ToggleButton
        key={station.title}
        value={station}
        aria-label={station.title}
      >
        {station.title}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

export default StationPicker;
