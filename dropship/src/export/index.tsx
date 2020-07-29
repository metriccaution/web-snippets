/**
 * Produce exportable files
 */

import marked from "marked";
import { Component, h, RefObject, createRef } from "preact";
import Preview from "../preview";

import "./index.scss";

// TODO - Re-use style sheet from main app
// Non-elegant way to style up exported HTML - Raw CSS string here
const exportedStyles = `
html {
    width: 90%;
    padding-left: 2%;
    font: sans-serif;
}

img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
}

table {
    margin: 0 auto;
    border-spacing: 0.5rem;
    border-collapse: collapse;
}

table th,td {
  border-color: #444;
  border-style: solid;
  border-width: 1px;
  padding: 0.5em;
}

code, pre {
    color: #444;
}

blockquote {
  background-color: rgb(51, 51, 51);
  color: rgb(204, 204, 204);
  padding: 0.75em;
}

.mermaid-diagram {
    text-align: center;
}

.mermaid-diagram > div {
    display: inline-block;
    background: #ffffff;
    width: 100%;
    padding: 1em;
}

.mermaid-diagram > div > svg {
    padding: 1em;
    max-width: 100%;
}
`.trim();

/**
 * Required properties for exporting
 */
export interface ExportProps {
  markdown: string;
}

/**
 * Tooling for exporting the page to HTML
 */
export default class ExportTab extends Component<ExportProps, {}> {
  private editorRef: RefObject<HTMLDivElement>;

  constructor(properties: ExportProps) {
    super(properties);
    this.editorRef = createRef();
    this.state = {};
  }

  /**
   * Pick a sensible name for the export
   *
   * @param markdown Markdown text
   */
  private getMarkdownTitle(markdown: string): string {
    const defaultTitle = "Exported Page";

    // TODO - Don't re-parse the document?
    for (const token of marked.lexer(markdown)) {
      if (token.type === "heading") {
        return token.text;
      }
    }

    return defaultTitle;
  }

  /**
   * Open the rendered markdown in its own tab
   */
  private openAsTab(): void {
    if (!this.editorRef.current) {
      return;
    }

    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      return;
    }
    newWindow.document.write(this.markdownAsHtml());
  }

  /**
   * Download the plain markdown to file
   */
  private downloadMarkdown(): void {
    if (!this.editorRef.current) {
      return;
    }

    const title = this.getMarkdownTitle(this.props.markdown);
    this.saveData(
      `${new Date().toISOString()} - ${title}.md`,
      this.props.markdown
    );
  }

  /**
   * Download rendered HTML to file
   */
  private downloadHtml(): void {
    if (!this.editorRef.current) {
      return;
    }

    const title = this.getMarkdownTitle(this.props.markdown);
    this.saveData(
      `${new Date().toISOString()} - ${title}.html`,
      this.markdownAsHtml()
    );
  }

  /**
   * Render the markdown to HTML
   */
  private markdownAsHtml(): string {
    if (!this.editorRef.current) {
      return "";
    }

    const title = this.getMarkdownTitle(this.props.markdown);

    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>${title}</title>
            <style>
                ${exportedStyles}
            </style>
        </head>
        <body>
            ${this.editorRef.current.innerHTML}
        </body>
    </html>`;
  }

  /**
   * Download some data to file
   *
   * @param fileName Filename to download to
   * @param contents Contents of the download
   */
  private saveData(fileName: string, contents: string): void {
    const encoded = btoa(contents);
    const url = `data:/text/plain;base64,${encoded}`;

    const link = document.createElement("a");
    link.target = "_blank";
    link.download = fileName;
    link.href = url;

    document.body.append(link);
    link.click();
    link.remove();
  }

  public render(): h.JSX.Element {
    return (
      <div class="export">
        <button onClick={this.openAsTab.bind(this)}>Open In New Tab</button>
        <button onClick={this.downloadMarkdown.bind(this)}>
          Download Markdown
        </button>
        <button onClick={this.downloadHtml.bind(this)}>Download HTML</button>

        {/* Use a hidden preview tab to render the page */}
        <div class="html-render" ref={this.editorRef}>
          <Preview markdown={this.props.markdown} />
        </div>
      </div>
    );
  }
}
