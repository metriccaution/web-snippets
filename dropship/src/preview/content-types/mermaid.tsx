/**
 * Render mermaid diagrams in-line
 */

import mermaid from "mermaid";
import { h, Component, createRef, RefObject } from "preact";

export interface MermaidProps {
  diagramId?: string;
  source: string;
}

export interface MermaidState {
  id: string;
  renderState: "loading" | "rendered" | "error";
  error: string | null;
}

let diagramCount = 0;

/**
 * Wrap Mermaid in a react component
 */
export default class Mermaid extends Component<MermaidProps, MermaidState> {
  private mermaidEl: RefObject<HTMLDivElement>;

  constructor(properties: MermaidProps) {
    super(properties);
    this.mermaidEl = createRef();

    const elementId =
      properties.diagramId || `dropship-mermaid-${diagramCount++}`;

    this.state = {
      id: elementId,
      renderState: "loading",
      error: null,
    };
  }

  public componentDidMount(): void {
    try {
      mermaid.mermaidAPI.render(this.state.id, this.props.source, (svg) => {
        if (this.mermaidEl.current) {
          // TODO - Why is this breaking?
          // https://github.com/mermaid-js/mermaid/blob/develop/src/mermaidAPI.js#L761
          const fixedSvg = svg.replace(/font: ;/, "");

          this.mermaidEl.current.innerHTML = fixedSvg;

          // Some versions of Chrome seem to set a maxWidth here, but we already handle this
          // and it sets it slightly wrong
          const renderedSvg = this.mermaidEl.current.querySelector("svg");
          if (renderedSvg && renderedSvg.style.maxWidth) {
            renderedSvg.style.maxWidth = "";
          }

          this.setState({
            renderState: "rendered",
            error: null,
          });
        }
      });
    } catch (error) {
      this.setState({
        renderState: "error",
        error: error.message,
      });
    }
  }

  public render(): h.JSX.Element {
    const wrapperId =
      this.state.renderState !== "loading"
        ? this.state.id + "-container"
        : this.state.id;

    const message = ((): string | h.JSX.Element | null => {
      switch (this.state.renderState) {
        case "loading":
          return "Rendering diagram...";
        case "error":
          return (
            <div>
              Error in Mermaid syntax:
              <pre>{this.state.error}</pre>
            </div>
          );
        default:
          return null;
      }
    })();

    return (
      <div class="mermaid-diagram">
        <div id={wrapperId} ref={this.mermaidEl} />
        {message}
      </div>
    );
  }
}
