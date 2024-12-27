import { describe, expect, test } from "vitest";
import {
  primeFactors,
  greatestCommonDivisor,
  leastCommonMultiple,
} from "./primes";

describe("primeFactors", () => {
  const factorTests: [number, number[]][] = [
    [2, [2]],
    [3, [3]],
    [4, [2, 2]],
    [5, [5]],
    [6, [2, 3]],
    [7, [7]],
    [8, [2, 2, 2]],
    [9, [3, 3]],
    [10, [2, 5]],
    [20, [2, 2, 5]],
    [100, [2, 2, 5, 5]],
    [102, [2, 3, 17]],
    [103, [103]],
  ];

  for (const [num, factors] of factorTests) {
    test(`Factorising ${num}`, () => {
      expect(primeFactors(num)).toEqual(factors);

      // Sense-check the actual test case
      expect(factors.reduce((a, i) => a * i, 1)).toBe(num);
      factors.forEach((factor) =>
        expect(primeFactors(factor)).toEqual([factor]),
      );
    });
  }
});

describe("greatestCommonDivisor", () => {
  const gcdTests: [number, number, number][] = [
    [1, 1, 1],
    [1, 2, 1],
    [2, 4, 2],
    [3, 15, 3],
    [15, 3, 3],
    [48, 18, 6],
    [8, 12, 4],
    [54, 24, 6],
    [103, 103, 103],
  ];

  for (const [a, b, gcd] of gcdTests) {
    test(`GCD(${a}, ${b}) = ${gcd}`, () => {
      expect(greatestCommonDivisor(a, b)).toBe(gcd);
    });
  }
});

describe("leastCommonMultiple", () => {
  const lcmTests: [number, number, number][] = [
    [1, 1, 1],
    [1, 2, 2],
    [2, 4, 4],
    [6, 4, 12],

    [6, 21, 42],
    [3, 15, 15],
    [2, 15, 30],
    [2, 103, 206],
  ];

  for (const [a, b, lcm] of lcmTests) {
    test(`LCM(${a}, ${b}) = ${lcm}`, () => {
      expect(leastCommonMultiple(a, b)).toBe(lcm);
    });
  }
});
