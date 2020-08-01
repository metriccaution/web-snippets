import {
  flatten,
  uniq,
  uniqBy,
  intersection,
  difference,
  flatMap,
} from "lodash";
import flexsearch from "flexsearch";
import { derived, writable } from "svelte/store";
import { DataSource, FullSpell, Spell } from "./spell-types";

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
 * A text-search index of the spells
 */
const indexedSpells = derived(compiledSpells, (spells) => {
  const start = Date.now();
  const index = flexsearch.create({
    doc: {
      id: "name",
      // TODO - Aliases
      field: ["name", "description", "higherLevel"],
    },
  });

  for (const spell of spells) {
    index.add({
      name: spell.name,
      description: spell.description,
      higherLevel: spell.higherLevel || "",
    });
  }
  console.log("Indexed in", Date.now() - start);

  return index;
});
/**
 * Spells matching the current search
 */
export const filteredSpells = derived(
  [searchTerm, indexedSpells, compiledSpells],
  ([term, index, spells]) => {
    if (!term) return spells;

    const matches: string[] = (index.search(term) as any).map(
      (spell) => spell.name
    );
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

  const ret: string[][] = [];
  for (const aliasSet of aliases) {
    const match = ret.find((s) => intersection(aliasSet, s).length > 0);
    if (match) {
      changed = true;
      const toAdd: string[] = difference(aliasSet, match);
      toAdd.forEach((s) => match.push(s));
    } else {
      ret.push(aliasSet);
    }
  }

  return changed ? consolidate(ret) : ret;
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
