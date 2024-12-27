import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FC } from "react";
import type { StationConfig } from "../stations";

export interface StationPickerProps {
  stations: StationConfig[];
  value: StationConfig | undefined;
  onChange: (station: StationConfig) => void;
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
