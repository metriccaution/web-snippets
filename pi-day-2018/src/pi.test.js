import { makePoints } from "./pi";

test("Correct number of points made", () => {
  for (let i = 0; i < 100; i++) {
    const points = makePoints(i);
    expect(points).toHaveLength(i);

    for (const { x, y } of points) {
      expect(x).toBeLessThanOrEqual(1);
      expect(y).toBeLessThanOrEqual(1);

      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
    }
  }
});
