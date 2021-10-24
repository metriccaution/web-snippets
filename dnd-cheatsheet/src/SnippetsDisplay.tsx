import React from "react";
import { useRecoilValue } from "recoil";
import marked from "marked";

import type { InfoSnippet } from "./snippets";
import { matchingResults } from "./search";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

const InfoCard = styled(Card)(() => ({
  margin: "1em",
}));

const MarkdownContainer = styled("span")(() => ({
  lineHeight: "1.4em",
  "& table": {
    margin: "0 auto",

    "& td, th": {
      padding: "0.5rem",
    },
    "& tr:nth-child(even)": {
      backgroundColor: "#eee",
    },
  },
}));

const SpinnerContainer = styled("div")(() => ({
  textAlign: "center",
  padding: "2em",
}));

// TODO - Error handling

export const Markdown = ({ markdown }: { markdown: string }) => (
  <MarkdownContainer dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
);

export const Snippet = ({ snippet }: { snippet: InfoSnippet }) => (
  <InfoCard>
    <CardContent>
      <Markdown markdown={snippet.body.replace(/^(#+)/gim, "$1#")} />
    </CardContent>
  </InfoCard>
);

const SnippetList = () => {
  const snippets = useRecoilValue(matchingResults);

  return (
    <>
      {snippets.map((snippet) => (
        <Snippet key={snippet.title} snippet={snippet} />
      ))}
    </>
  );
};

const LoadingResults = () => (
  <SpinnerContainer>
    <CircularProgress />
  </SpinnerContainer>
);

export const SearchResults = () => {
  return (
    <React.Suspense fallback={<LoadingResults />}>
      <SnippetList />
    </React.Suspense>
  );
};
