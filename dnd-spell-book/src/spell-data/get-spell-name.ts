import type { FullSpell } from "./spell-types";

export function getName(spell: FullSpell): string {
  // TODO - Make this slightly smarter
  return spell.names[0].name;
}
