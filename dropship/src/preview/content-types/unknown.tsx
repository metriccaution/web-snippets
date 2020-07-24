/**
 * Render that we don't know how to render a content block
 */
import { h, FunctionalComponent } from "preact";

/**
 * Required properties for rendering
 */
export interface PreviewProps {
  type: string;
}

/**
 * Render the source page out
 *
 * @param props Data for rendering
 */
const Preview: FunctionalComponent<PreviewProps> = ({ type }: PreviewProps) => (
  <div class="error-block">
    Unable to handle content type <span class="type">{type}</span> right now,
    sorry!
  </div>
);

export default Preview;
