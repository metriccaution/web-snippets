/**
 * Lowest number that divides by A and B
 */
export const leastCommonMultiple = (a: number, b: number): number =>
  (a * b) / greatestCommonDivisor(a, b);

/**
 * Largest number that divides 2 others
 */
export const greatestCommonDivisor = (a: number, b: number): number => {
  const aFactors = primeFactors(a);
  const bFactors = primeFactors(b);

  let gcd = 1;

  for (const factor of new Set([...aFactors, ...bFactors])) {
    const count = Math.min(
      aFactors.filter((f) => f === factor).length,
      bFactors.filter((f) => f === factor).length,
    );

    gcd *= Math.pow(factor, count);
  }

  return gcd;
};

/**
 * Factorise a number
 */
export const primeFactors = (toFactor: number): number[] => {
  const factors = [];
  let divisor = 2;

  while (toFactor >= 2) {
    if (toFactor % divisor == 0) {
      factors.push(divisor);
      toFactor = toFactor / divisor;
    } else {
      divisor++;
    }
  }

  return factors;
};
