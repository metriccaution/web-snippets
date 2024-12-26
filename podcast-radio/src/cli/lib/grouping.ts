/**
 * Methods to combine playlists.
 */

import { shuffle } from "es-toolkit";
import type { Episode } from "../../stations";
import type { StationSource } from "./stations";

/**
 * Combine different podcast's episodes different ways.
 */
export const combine = (
  mode: StationSource["combineBy"],
  groups: Episode[][],
): Episode[] => {
  switch (mode) {
    case "as-is":
      return groups.flat();
    case "shuffle":
      return shuffle(groups.flat());
    case "interleave": {
      const shortestList = groups
        .map((g) => g.length)
        .reduce((m, i) => Math.min(m, i), Number.MAX_SAFE_INTEGER);

      const chunks: Episode[][] = new Array(shortestList).fill([]);

      for (const group of groups) {
        const groupSize = Math.floor(group.length / shortestList);
        const bonuses = group.length - groupSize * shortestList;

        let start = 0;
        for (let i = 0; i < shortestList; i++) {
          const length = i < bonuses ? groupSize + 1 : groupSize;
          const end = start + length;
          chunks[i] = [...chunks[i], ...group.slice(start, end)];
          start = end;
        }
      }

      return chunks.flat();
    }
    default: {
      throw new Error(`No handler for combination mode ${mode}`);
    }
  }
};
