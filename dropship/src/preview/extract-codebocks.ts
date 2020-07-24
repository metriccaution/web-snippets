/**
 * Code for splitting out different content types for rendering
 */

// TODO - This may be more reliable if I just hook into marked's rendering for code blocks

/**
 * A block of code inside the document
 */
export interface CodeBlock {
  type: "markdown" | "mermaid";
  contents: string;
}

/**
 * Split out various types of content to render. This is done by identifying
 * particular types of markdown code block, and pulling them from the document.
 */
export default (markdownText: string): CodeBlock[] =>
  markdownText
    .split("```")
    // Work out what type each block is
    .map(
      (block, index): CodeBlock => {
        // Odd sections will be codeblocks, because of how split works
        const isCodeblock = index % 2 === 1;

        const lines = block.trim().split("\n");
        const firstLine = lines[0].trim();

        switch (firstLine) {
          case "mermaid":
            return {
              type: "mermaid",
              contents: lines.slice(1).join("\n"),
            };
          default:
            return {
              type: "markdown",
              contents: isCodeblock
                ? // If this is a code-block, put its formatting back
                  "``` " + block + "\n```"
                : // Otherwise, just return it back
                  block,
            };
        }
      }
    );
