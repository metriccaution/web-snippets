import React from "react";
import { insideCircle } from "./pi";

const Graph = ({ points, size }) => {
  const pointSize = Math.ceil(size / 250);
  const pointEls = points.map((point, i) => (
    <circle
      key={i}
      cx={point.x * size}
      cy={point.y * size}
      r={pointSize}
      style={{ fill: insideCircle(point) ? "chartreuse" : "red" }}
    />
  ));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      style={{ height: size, width: size }}
    >
      <circle cx="0" cy="0" r={size} />
      {pointEls}
    </svg>
  );
};

export default Graph;
