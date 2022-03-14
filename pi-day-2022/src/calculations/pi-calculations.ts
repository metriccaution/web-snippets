/**
 * The result of calculating Pi
 */
export interface PiEvent {
  pi: number;
  coloured: number;
}

/**
 * Approximate pi for just a single line
 */
export const lineApproximation = (
  coloured: number,
  radius: number,
): PiEvent => ({
  coloured,
  pi: coloured / (2 * radius),
});

/**
 * Approximate pi for a regular circle
 */
export const circleApproximation = (
  coloured: number,
  radius: number,
): PiEvent => ({
  coloured,
  pi: coloured / Math.pow(radius, 2),
});

/**
 * Approximate pi for a circle cut out of another circle
 */
export const nestedCircleApproximation = (
  coloured: number,
  innerRadius: number,
  outerRadius: number,
): PiEvent => ({
  coloured,
  pi: coloured / (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)),
});
