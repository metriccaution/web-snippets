import { flatten, uniq, uniqBy, flatMap, memoize } from "lodash";
import { derived, writable, Readable } from "svelte/store";
import { DataSource, FullSpell, Spell } from "./spell-types";
import { getSpellText } from "./markdown-to-text";
import asRegex from "./text-to-regex";

export type { FullSpell } from "./spell-types";

// TODO - Push some of the work here off the main thread

/**
 * All of the original sources of spell data, unmerged
 */
export const rawSpells = writable<DataSource[]>([]);
/**
 * The current search term
 */
export const searchTerm = writable("");
/**
 * The merged contents of all the spells
 */
export const compiledSpells = derived(rawSpells, (spells) => {
  const start = Date.now();
  const data = collateData(spells);
  console.log("Collated in", Date.now() - start);
  return data;
});
/**
 * Spells matching the current search
 */
export const filteredSpells: Readable<FullSpell[]> = derived(
  [searchTerm, compiledSpells],
  ([term, spells]) => {
    // TODO - This breaks when searching while something's selected
    if (!term) return spells;

    const matches: string[] = spells
      .filter(spellMatchesSearch.bind(null, asRegex(term)))
      .map((spell) => spell.name);
    return spells.filter((spell) => matches.includes(spell.name));
  }
);
/**
 * Consolidate down the list of all aliases so that all things that refer to
 * the same spell are in the same place.
 *
 * @param aliases List of all of the aliases
 */
const consolidate = (aliases: string[][]): string[][] => {
  let changed = false;

  const ret: Set<string>[] = [];
  for (const aliasSet of aliases) {
    const match = ret.find((s) => aliasSet.some((a) => s.has(a)));
    if (match) {
      changed = true;
      aliasSet.forEach((a) => match.add(a));
    } else {
      ret.push(new Set<string>(aliasSet));
    }
  }

  const retArrays = ret.map((s) => Array.from(s));
  return changed ? consolidate(retArrays) : retArrays;
};

/**
 * Munge down a number of data sets into a cohearant list of spells
 */
function collateData(data: DataSource[]): FullSpell[] {
  // TODO - This is a performance disaster zone
  const allSpells = flatten(data.map((source) => source.spells));
  const sources = flatten(data.map((source) => source.sources));
  const pageData = flatten(data.map((source) => source.pages));

  const groupedAliases: string[][] = consolidate([
    ...flatMap(data, (source) => source.spells.map((s) => [s.name])),
    ...flatMap(data, (source) => source.aliases.map((a) => a.names)),
  ]);

  // Dedupe spells across aliases
  const getUniqueId = (spell: Spell) =>
    groupedAliases.findIndex((group) => group.includes(spell.name));
  const baseSpells: Spell[] = uniqBy(allSpells, getUniqueId).sort(
    (a, b) => a.level - b.level || a.name.localeCompare(b.name)
  );

  return baseSpells.map((spell) => {
    const names = groupedAliases.find((group) => group.includes(spell.name));
    if (!names) {
      throw new Error(`No names block for ${spell.name}`);
    }

    // Pick the longest name for this spell, its probably most interesting
    const spellName = names.sort((a, b) => b.length - a.length)[0];
    const aliases = uniq(names.filter((name) => name !== spellName)).sort();

    const spellNames = [...aliases, spell.name];
    const matches = sources.filter((source) =>
      source.spells.some((spellName) => spellNames.indexOf(spellName) > -1)
    );

    const knownBy: string[] = matches.map((source) => source.knownBy).sort();

    const spellPages = pageData
      .filter((page) => spellNames.indexOf(page.spellName) > -1)
      .map((page) => page.page)
      .sort(
        (a, b) => a.book.localeCompare(b.book) || a.pageNumber - b.pageNumber
      );

    // TODO - This definitely needs some work...
    const license = data.map((d) => d.license).filter(Boolean);

    return {
      ...spell,
      name: spellName,
      aliases,
      knownBy: uniq(knownBy),
      pages: uniqBy(spellPages, (page) => page.book + page.pageNumber),
      license,
    };
  });
}

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
