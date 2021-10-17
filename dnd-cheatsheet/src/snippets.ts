import { selector } from "recoil";

export interface InfoSnippet {
  title: string;
  body: string;
}

const fetchRecords = async (): Promise<InfoSnippet[]> => {
  const res = await fetch("./public/info.json");
  if (!res.ok) {
    throw new Error(`Failed to fetch records`);
  }

  return res.json();
};

export const informationSnippets = selector<InfoSnippet[]>({
  key: "information",
  get: async () => {
    return await fetchRecords();
  },
});

export const snippetTitles = selector<string[]>({
  key: "snippetTitles",
  get: ({ get }) => get(informationSnippets).map((snippet) => snippet.title),
});
