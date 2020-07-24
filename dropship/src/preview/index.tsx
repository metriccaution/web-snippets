/**
 * Rendering the source to a document
 */
import { h, FunctionalComponent } from "preact";
import extractCodeBlocks from "./extract-codebocks";

import Markdown from "./content-types/markdown";
import Mermaid from "./content-types/mermaid";
import Unknown from "./content-types/unknown";

import "./index.scss";

/**
 * Required properties for rendering
 */
export interface PreviewProps {
  markdown: string;
}

/**
 * Render the source page out
 *
 * @param props Data for rendering
 */
const Preview: FunctionalComponent<PreviewProps> = ({
  markdown,
}: PreviewProps) => (
  <div class="preview">
    {extractCodeBlocks(markdown).map(({ type, contents }, index) => {
      switch (type) {
        case "markdown":
          return <Markdown key={`${type}-${index}`} markdown={contents} />;
        case "mermaid":
          return <Mermaid key={`${type}-${index}`} source={contents} />;
        default:
          return <Unknown key={`${type}-${index}`} type={type} />;
      }
    })}
  </div>
);

export default Preview;
