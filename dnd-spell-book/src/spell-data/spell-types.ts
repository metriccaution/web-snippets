/**
 * Data types for spells
 */

/**
 * A collection of data
 */
export interface Book {
  /**
   * The name of this book
   */
  name: string;
  /**
   * Any licensing information (markdown)
   */
  license: string;
  /**
   * Any spells in this book
   */
  spells: Spell[];
  /**
   * A URL where more information about the book can be found
   */
  url: string;
  /**
   * A bit of a blurb about this book
   */
  description: string;
  /**
   * Knowledge about who knows which spells from this book
   */
  knownBy: KnownBy[];
}

/**
 * Common data that we store about data from an individual book - i.e. a spell,
 * or who knows a spell
 */
export interface FromABook {
  /**
   * Page number within the book
   */
  pageNumber: number;
}

/**
 * A listing of who knows which spells
 */
export interface KnownBy extends FromABook {
  /**
   * Who knows this spell
   */
  knownBy: string;
  /**
   * IDs of spells this
   */
  spellIds: string[];
}

/**
 * All of the details stored about a spell.
 */
export interface Spell extends FromABook {
  /**
   * Unique ID, shared across books - Used for collation
   */
  id: string;
  /**
   * The name of this spell
   */
  name: string;
  /**
   * A description of what this spell does (markdown)
   */
  description: string;
  /**
   * Any additional effects from casting the spell at a higher level (empty when
   * there are no additional effect) (markdown)
   */
  higherLevel: string;
  /**
   * How far will the spell reach
   */
  range: string;
  /**
   * The various components to spell casting required for this spell
   */
  components: string[];
  /**
   * What materials does the spell need
   */
  material?: string;
  /**
   * Can this spell be cast as a ritual
   */
  ritual: boolean;
  /**
   * Does this spell require concentration
   */
  concentration: boolean;
  /**
   * How long does the spell last once it's been cast
   */
  duration: string;
  /**
   * How long does this spell take to cast
   */
  castingTime: string;
  /**
   * What school of magic does this spell belong to
   */
  school: string;
  /**
   * The level of this spell - 0-9 (with 0 being a cantrip)
   */
  level: number;
}

/**
 * Information specific to one book about a spell (e.g. who knows it)
 */
export interface BookData {
  name: string;
  bookName: string;
  pageNumber: number;
}

/**
 * All of the collated data about a spell
 */
export interface FullSpell {
  /**
   * Unique ID, shared across books - Used for collation
   */
  id: string;
  /**
   * A description of what this spell does (markdown)
   */
  description: string;
  /**
   * Any additional effects from casting the spell at a higher level (empty when
   * there are no additional effect) (markdown)
   */
  higherLevel: string;
  /**
   * How far will the spell reach
   */
  range: string;
  /**
   * The various components to spell casting required for this spell
   */
  components: string[];
  /**
   * What materials does the spell need
   */
  material?: string;
  /**
   * Can this spell be cast as a ritual
   */
  ritual: boolean;
  /**
   * Does this spell require concentration
   */
  concentration: boolean;
  /**
   * How long does the spell last once it's been cast
   */
  duration: string;
  /**
   * How long does this spell take to cast
   */
  castingTime: string;
  /**
   * What school of magic does this spell belong to
   */
  school: string;
  /**
   * The level of this spell - 0-9 (with 0 being a cantrip)
   */
  level: number;
  /**
   * Any other names this spell has
   */
  names: BookData[];
  /**
   * Who knows this spell
   */
  knownBy: BookData[];
  /**
   * Licensing info for this spell
   */
  license: string[];
}
