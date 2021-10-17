import React from "react";
import { render } from "react-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { searchText } from "./search";
import { SearchResults } from "./SnippetsDisplay";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";

const SearchInputField = styled(InputBase)(({ theme }) => ({
  marginLeft: "1em",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  "& .MuiInputBase-input": {
    color: theme.palette.common.white,
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `1em`,
  },
}));

const CardList = styled("div")(() => ({
  maxWidth: "80%",
  margin: "0 auto",
}));

function SearchInput() {
  const [text, setText] = useRecoilState(searchText);

  return (
    <div>
      <SearchInputField
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search..."
      />
    </div>
  );
}

const App = () => (
  <>
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div">
          {"D&D Cheatsheet"}
        </Typography>
        <SearchInput />
      </Toolbar>
    </AppBar>
    <CardList>
      <SearchResults />
    </CardList>
  </>
);

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.querySelector("#main")
);
