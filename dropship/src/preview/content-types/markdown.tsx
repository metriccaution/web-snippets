/**
 * Render markdown to HTML
 */
import marked from "marked";
import { h, FunctionalComponent } from "preact";

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
const Markdown: FunctionalComponent<PreviewProps> = ({
  markdown,
}: PreviewProps) => (
  <div
    class="markdown-preview"
    dangerouslySetInnerHTML={{ __html: marked(markdown) }}
  />
);

export default Markdown;
