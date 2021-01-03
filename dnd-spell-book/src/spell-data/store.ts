import { memoize } from "lodash";
import { derived, writable, Readable, Writable } from "svelte/store";
import { getSpellText } from "./markdown-to-text";
import collateData from "./collate";
import compileRegex from "./text-to-regex";
import type { Book, FullSpell } from "./spell-types";
import { getName } from "./get-spell-name";

/**
 * All of the original sources of spell data, unmerged
 */
export const rawSpells: Writable<Book[]> = writable([]);

/**
 * The current search term
 */
export const searchTerm: Writable<string> = writable("");

/**
 * The merged contents of all the spells
 */
export const compiledSpells: Readable<FullSpell[]> = derived(
  rawSpells,
  (spells) => {
    const start = Date.now();
    const data = collateData(spells);
    console.log("Collated in", Date.now() - start);
    return data;
  }
);

/**
 * Spells matching the current search
 */
export const filteredSpells: Readable<FullSpell[]> = derived(
  [searchTerm, compiledSpells],
  ([term, spells]) => {
    // TODO - This breaks when searching while something's selected
    if (!term) return spells.sort((a, b) => compareSpells(a, b));

    return spells
      .filter((spell) => spellMatchesSearch(compileRegex(term), spell))
      .sort((a, b) => compareSpells(a, b));
  }
);

const cachedSpellText = memoize(getSpellText);

/**
 * Does a spell match a search term
 *
 * @param term Text search term
 * @param spell Spell to check
 */
function spellMatchesSearch(term: RegExp, spell: FullSpell): boolean {
  return term.test(cachedSpellText(spell));
}

/**
 * Sorting function for spells
 */
function compareSpells(a: FullSpell, b: FullSpell): number {
  const levelSort = a.level - b.level;
  const nameSort = getName(a).localeCompare(getName(b));

  return levelSort || nameSort;
}
