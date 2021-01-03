import { groupBy, values, flatten, uniq } from "lodash";
import type { Book, BookData, FullSpell, Spell } from "./spell-types";

/**
 * Collate a number of books into compiled spells, joining up duplicated data,
 * and listing out who knows what.
 */
export default function collate(books: Book[]): FullSpell[] {
  // Group spells up by ID
  const allSpells = flatten(books.map(book => book.spells));
  const groupedSpells: Spell[][] = values(groupBy(allSpells, "id"));

  // Collect metadata we'll need later, by spell ID
  const namesMetadata = new Map<string, BookData[]>();
  const knownByMetadata = new Map<string, BookData[]>();
  const licenceMetadata = new Map<string, string[]>();
  for (const book of books) {
    for (const spell of book.spells) {
      const namesList = namesMetadata.get(spell.id) || [];
      namesMetadata.set(spell.id, [
        ...namesList,
        {
          name: spell.name,
          bookName: book.name,
          pageNumber: spell.pageNumber
        }
      ]);

      const licences = licenceMetadata.get(spell.id) || [];
      licenceMetadata.set(spell.id, uniq([...licences, book.license]));
    }

    for (const knownBy of book.knownBy) {
      for (const spellId of knownBy.spellIds) {
        const knownList = knownByMetadata.get(spellId) || [];
        knownByMetadata.set(spellId, [
          ...knownList,
          {
            bookName: book.name,
            name: knownBy.knownBy,
            pageNumber: knownBy.pageNumber
          }
        ]);

        const licences = licenceMetadata.get(spellId) || [];
        licenceMetadata.set(spellId, uniq([...licences, book.license]));
      }
    }
  }

  return groupedSpells.map(spellGroup => {
    const spell = spellGroup[0]; // Pick a 'primary' spell

    const licence: string[] = licenceMetadata.get(spell.id) || [];
    const knownBy: BookData[] = knownByMetadata.get(spell.id) || [];
    const names: BookData[] = namesMetadata.get(spell.id) || [];

    const merged = {
      castingTime: spell.castingTime,
      components: spell.components,
      concentration: spell.concentration,
      description: spell.description,
      duration: spell.duration,
      higherLevel: spell.higherLevel,
      id: spell.id,
      level: spell.level,
      range: spell.range,
      ritual: spell.ritual,
      school: spell.school,
      material: spell.material,
      license: licence.sort(),
      names: names.sort(compareProvenance),
      knownBy: knownBy.sort(compareProvenance)
    };

    if (!spell.material) {
      delete merged.material;
    }

    return merged;
  });
}

/**
 * Sorting function for two provenance blocks
 */
function compareProvenance(a: BookData, b: BookData): number {
  return a.bookName.localeCompare(b.bookName) || a.pageNumber - b.pageNumber;
}
