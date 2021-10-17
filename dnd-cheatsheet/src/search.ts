import { atom, selector } from "recoil";
import lunr from "lunr";
import { InfoSnippet, informationSnippets } from "./snippets";
import type { Index } from "lunr";

// TODO - Do some exact text matching too

export const searchText = atom<string>({
  key: "searchText",
  default: "",
});

const makeSearch = (index: Index, text: string): string[] => {
  const results = index.search(text) as any;
  return results.map((item: { ref: string }): string => item.ref);
};

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

export const matchingResults = selector<InfoSnippet[]>({
  key: "searchResults",
  get: ({ get }) => {
    const text = get(searchText);
    const snippets = get(informationSnippets);
    const index = get(searchIndex);

    const results = makeSearch(index, text).map((ref) =>
      snippets.find((item) => item.title === ref)
    );

    return results;
  },
});
