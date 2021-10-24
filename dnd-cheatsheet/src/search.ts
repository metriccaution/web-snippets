import { selector } from "recoil";
import lunr from "lunr";
import { InfoSnippet, informationSnippets } from "./snippets";
import { urlParamAtom } from "./url-params";
import type { Index } from "lunr";

export const searchText = urlParamAtom("search", "");

const fetchSearchIndex = async (): Promise<any> => {
  const res = await fetch("./public/search.json");
  if (!res.ok) {
    throw new Error(`Failed to fetch records`);
  }

  return res.json();
};

const searchIndexData = selector<InfoSnippet[]>({
  key: "searchIndexData",
  get: async () => fetchSearchIndex(),
});

const searchIndex = selector<Index>({
  key: "searchIndex",
  get: ({ get }) => {
    const rawData = get(searchIndexData);
    const index: Index = lunr.Index.load(rawData);

    return index;
  },
});

/**
 * Search logic
 */
const findMatches = (
  items: InfoSnippet[],
  searchIndex: Index,
  searchText: string
): InfoSnippet[] => {
  const matchingTitles: string[] = [];

  // Fuzzy text matching with Lunr
  const fuzzyResults = searchIndex.search(searchText) as Array<{ ref: string }>;
  fuzzyResults
    .map((item: { ref: string }): string => item.ref)
    .forEach((title) => {
      if (!matchingTitles.includes(title)) {
        matchingTitles.push(title);
      }
    });

  // Exact text matching
  const convertText = (text: string): string => text.toLocaleLowerCase();
  const plainSearchText = convertText(searchText);
  items
    .map((item): InfoSnippet => ({ ...item, body: convertText(item.body) }))
    .filter((item) => item.body.includes(plainSearchText))
    .forEach((item) => {
      if (!matchingTitles.includes(item.title)) {
        matchingTitles.push(item.title);
      }
    });

  // Turn matching titles into matching objects
  const matches: InfoSnippet[] = [];
  for (const title of matchingTitles) {
    const item = items.find((item) => item.title === title);
    if (item) {
      matches.push(item);
    }
  }

  return matches;
};

export const matchingResults = selector<InfoSnippet[]>({
  key: "searchResults",
  get: ({ get }) => {
    const text = get(searchText);
    const snippets = get(informationSnippets);
    const index = get(searchIndex);

    return findMatches(snippets, index, text || "");
  },
});
