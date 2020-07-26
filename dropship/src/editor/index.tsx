/**
 * Text editor component - Largely a simplifying wrapper around Code Mirror
 */

import { h, Component, createRef, RefObject } from "preact";
import CodeMirror from "codemirror";
import "./index.scss";

// Codemirror customisation
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/theme/moxer.css";

export interface CodeMirrorProps {
  tabWidth: number;
  value: string;
  onChange: (text: string) => void;
}

/**
 * Wrapper around the text-editor component
 */
export default class Editor extends Component<CodeMirrorProps, {}> {
  private editorRef: RefObject<HTMLDivElement>;
  private editor: CodeMirror.Editor | null;

  constructor(properties: CodeMirrorProps) {
    super(properties);

    this.editorRef = createRef();
    this.editor = null;
  }

  public componentDidMount(): void {
    if (this.editorRef.current) {
      this.editor = CodeMirror(this.editorRef.current, {
        value: this.props.value,
        mode: {
          name: "markdown",
          highlightFormatting: true,
        },
        theme: "moxer",
        tabSize: this.props.tabWidth,
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
      });
      const editor = this.editor;

      editor.setOption("extraKeys", {
        Tab: function (cm) {
          const indentUnit = cm.getOption("indentUnit");
          if (!indentUnit) {
            throw new Error("Can't get tabs");
          }

          cm.replaceSelection(new Array(indentUnit + 1).join(" "));
        },
      });

      editor.on("change", () => {
        this.props.onChange(this.getText());
      });

      /**
       * Indentation on wrapped lines
       */
      const basePadding = 4; // Default, from inspection in-browser
      editor.on("renderLine", (instance, line, element) => {
        const charWidth = editor.defaultCharWidth();
        const offset =
          CodeMirror.countColumn(
            line.text,
            null,
            instance.getOption("tabSize") || 0
          ) * charWidth;
        // Pull the start of this line left
        element.style.textIndent = "-" + offset + "px";
        // Push the whole, wrapped line right
        element.style.paddingLeft = basePadding + offset + "px";
      });
    }
  }

  public componentWillReceiveProps(nextProperties: CodeMirrorProps): void {
    if (this.editor) {
      if (this.getText() !== nextProperties.value) {
        this.editor.setValue(nextProperties.value);
      }
    }
  }

  private getText(): string {
    return this.editor ? this.editor.getValue() : "";
  }

  public render(): h.JSX.Element {
    return <div class="editor-container" ref={this.editorRef} />;
  }
}
