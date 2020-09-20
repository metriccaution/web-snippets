import marked from "marked";
import { listen } from "svelte/internal";
import { FullSpell } from "./spell-types";

/**
 * Turn a markdown token into text
 * @param token The token to transform
 */
function getTokenText(token: marked.Token): string {
  if (!("type" in token)) {
    return "";
  }

  // If this token just contains other elements with text
  if ("tokens" in token && Array.isArray(token.tokens)) {
    return token.tokens.map(getTokenText).filter(Boolean).join(" ");
  }

  // Lists
  if ("items" in token && Array.isArray(token.items)) {
    return token.items.map(getTokenText).filter(Boolean).join(" ");
  }

  switch (token.type) {
    case "code":
    case "image":
    case "text":
      return token.text.trim();
    case "space":
      return "";
    case "table":
      // TODO - Update @types/marked to include the tokens list
      return [
        ...token.header,
        ...token.cells.map((row) => row.join(" ").trim()),
      ]
        .map((cell) => cell.trim())
        .join(" ");
    default:
      console.log("Unhandled token:", token);
      return "?????";
  }
}

/**
 * Get the raw text from some markdown
 *
 * @param markdown Raw markdown string
 */
export function getText(markdown: string): string {
  return marked
    .lexer(markdown)
    .map((md) => getTokenText(md).trim())
    .filter(Boolean)
    .join(" ");
}

/**
 * Get the plain text of a spell
 *
 * @param spell The spell object
 */
export function getSpellText(spell: FullSpell): string {
  return [
    getText(spell.name),
    getText(spell.description),
    getText(spell.higherLevel),
    getText(spell.range),
    getText(spell.material || ""),
    getText(spell.duration),
    getText(spell.castingTime),
    getText(spell.school),
    spell.pages.map((page) => getText(page.book)),
    ...spell.aliases.map((alias) => getText(alias)),
    ...spell.knownBy.map((knownBy) => getText(knownBy)),
  ].join("\n");
}
