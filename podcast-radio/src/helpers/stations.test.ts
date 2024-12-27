import { describe, expect, test } from "vitest";
import { cycleLength, produceCycle } from "./stations";

describe("cycleLength", () => {
  const cycleTestCases: Array<{ lengths: number[]; expected: number }> = [
    {
      lengths: [1],
      expected: 1,
    },
    {
      lengths: [103, 2],
      expected: 206,
    },
    {
      lengths: [3, 5, 15],
      expected: 15,
    },
    {
      lengths: [3, 3, 5, 15],
      expected: 15,
    },
    {
      lengths: [3, 3, 5, 15, 9],
      expected: 45,
    },
  ];

  for (const { expected, lengths } of cycleTestCases) {
    test(`Cycle for ${lengths.join(", ")}`, () => {
      expect(cycleLength(lengths)).toBe(expected);
    });
  }
});

describe("produceCycle", () => {
  const testArray = (identifier: string, length: number) =>
    new Array(length).fill(null).map((_, i) => `${identifier}${i + 1}`);

  const cycleTests = [
    {
      lists: [testArray("A", 3)],
      expected: ["A1", "A2", "A3"],
    },
    {
      lists: [testArray("A", 3), testArray("B", 3)],
      expected: ["A1", "B1", "A2", "B2", "A3", "B3"],
    },
    {
      lists: [testArray("A", 2), testArray("B", 1), testArray("C", 2)],
      expected: ["A1", "B1", "C1", "A2", "B1", "C2"],
    },
    {
      lists: [testArray("A", 2), testArray("B", 3)],
      expected: [
        "A1",
        "B1",
        "A2",
        "B2",
        "A1",
        "B3",
        "A2",
        "B1",
        "A1",
        "B2",
        "A2",
        "B3",
      ],
    },
  ];

  for (const { lists, expected } of cycleTests) {
    test(`Constructing a cycle for ${lists.map((l) => l.length).join(", ")} lists`, () => {
      expect(produceCycle(lists)).toEqual(expected);
    });
  }
});
