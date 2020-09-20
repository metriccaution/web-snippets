import asRegex from "./text-to-regex";

test("Valid regex", () => {
  const regex = asRegex("hello\\sworld");

  expect(regex.test("hello\tworld")).toBe(true);
  expect(regex.test("hello_world")).toBe(false);
});

test("Invalid regex", () => {
  const regex = asRegex(":(");

  expect(regex.test(":( :)")).toBe(true);
  expect(regex.test(":o :)")).toBe(false);
});

test("Invalid regex, with repeated invalid characters", () => {
  const regex = asRegex(":( :(");

  expect(regex.test(":( :( :)")).toBe(true);
  expect(regex.test(":( :)")).toBe(false);
});

test("Edge-cases around things that could be either", () => {
  // TODO - Does this want to spit out multiple regexs to check?
  const regex = asRegex("Hello! World, a = b? No");

  expect(regex.test("Hello! World, a = b No")).toBe(true);
  expect(regex.test("Aw")).toBe(false);
});
