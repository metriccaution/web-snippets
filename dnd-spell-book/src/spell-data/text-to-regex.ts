const regexSpecialCharacters = [
  "\\", // This needs to be first to avoid double-escaping
  ".",
  "^",
  "$",
  "?",
  "+",
  "*",
  "|",
  "&",
  "=",
  "!",
  "(",
  ")",
  "[",
  "]",
  "<",
  ">",
];

const escapeRegex = (regex: string) =>
  regexSpecialCharacters.reduce(
    (text, toEscape) =>
      text.replace(new RegExp("\\" + toEscape, "g"), "\\" + toEscape),
    regex
  );

/**
 * Robustly convert a string into a regex. If the regex isn't valid, then all
 * special terms are escaped and its used as a raw string.
 *
 * @param pattern User-entered string
 */
export default function compileRegex(pattern: string): RegExp {
  try {
    return new RegExp(pattern, "i");
  } catch (e) {
    return new RegExp(escapeRegex(pattern), "i");
  }
}
