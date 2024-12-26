import { FC } from "react";
import styled from "@emotion/styled";

const TimeContainer = styled.span`
  padding-right: 1rem;
`;

export interface TimeDisplayProps {
  label: string;
  date: Date;
}

const formatDate = (date: Date) =>
  `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;

const TimeDisplay: FC<TimeDisplayProps> = ({ label, date }) => {
  return (
    <TimeContainer>
      <b>{label}:</b> {formatDate(date)}
    </TimeContainer>
  );
};

export default TimeDisplay;
