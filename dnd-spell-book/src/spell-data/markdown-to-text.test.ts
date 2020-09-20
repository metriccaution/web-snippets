import { getText } from "./markdown-to-text";

markdownTest("Blank string", "", "");
markdownTest("Plain text", "Hello world", "Hello world");
markdownTest("Link text", "[Hello](world)", "Hello");
markdownTest("Image link", "![Hello](world)", "Hello");
markdownTest(
  "Bullet-point list",
  ["- Hello", "- world", "    - Sub-bullet"].join("\n"),
  "Hello world Sub-bullet"
);
markdownTest(
  "Table",
  `| Hello | World |
   | ----- | ----- |
   | Row 1 | Col 2 |
   | Row 2 | Col 3 |`
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean)
    .join("\n"),
  "Hello World Row 1 Col 2 Row 2 Col 3"
);
markdownTest(
  "Table with nested elements",
  `| Hello        | World     |
     | ------------ | --------- |
     | _Row 1_      | ~Col 2~   |
     | [Row 2](./x) | **Col 3** |`
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean)
    .join("\n"),
  // TODO - Not ideal
  "Hello World _Row 1_ ~Col 2~ [Row 2](./x) **Col 3**"
);
markdownTest(
  "Code blocks",
  ["```", "Hello", "world", "```"].join("\n"),
  "Hello\nworld"
);
markdownTest(
  "Indented text",
  ["    Hello", "    world"].join("\n"),
  "Hello\nworld"
);
markdownTest(
  "Indented text",
  ["> Hello", "> world"].join("\n"),
  "Hello\nworld"
);
markdownTest(
  "Mixed content document",
  `
Hello _world_

**Blah _blah_ blah**

- One
- [Two _three_](./four)

![five _six_](./seven)
[eight _nine_](./ten)

| A   | B   | C   |
| --- | --- | --- |
| D   | E   | F   |

`,
  "Hello world Blah blah blah One Two three five _six_ eight nine A B C D E F"
);

function markdownTest(description: string, markdown: string, rawText: string) {
  test(`Getting raw markdown text: ${description}`, () => {
    expect(getText(markdown)).toEqual(rawText);
  });
}

/*
marked
  .lexer(
    `
Hello _world_

**Blah blah blah**

- One
- [Two _three_](./four)

![five _six_](./seven)
[eight _nine_](./ten)

| A   | B   | C   |
| --- | --- | --- |
| D   | E   | F   |

`
  )
  .map((token) => getTokenText(token))
  .forEach((token) => console.log("Token:", token));

*/
