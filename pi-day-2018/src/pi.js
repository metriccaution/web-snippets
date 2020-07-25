export const makePoints = count =>
  Array.apply(null, { length: count }).map(() => ({
    x: Math.random(),
    y: Math.random()
  }));

export const insideCircle = ({ x, y }) => Math.sqrt(x * x + y * y) < 1;

const approximatePi = points =>
  (4 * points.filter(insideCircle).length) / points.length;

export const stepsToPi = points => [
  `With ${points.length} points, distributed at random in a 2 x 2 square.`,
  `${points.filter(insideCircle).length} lie inside a circle with radius 1.`,
  `(π * 1 * 1) / (2 * 2) of the area is covered by the circle, meaning that π is approximated by 4 * ${
    points.filter(insideCircle).length
  } / ${points.length}`,
  `π is approximately ${approximatePi(points).toFixed(8)}`,
  `With an error of ${Math.abs(Math.PI - approximatePi(points)).toFixed(8)}`
];
