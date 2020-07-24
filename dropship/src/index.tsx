import debounce from "p-debounce";
import prettier from "prettier/standalone";
import markdownParser from "prettier/parser-markdown";
import { h, render, Component } from "preact";
import Tabs from "./tabs";
import Editor from "./editor";
import Export from "./export";
import Preview from "./preview";
import "./index.scss";
import initialiseApp from "./init";

type TabName = "Editor" | "View" | "Export";

interface AppState {
  tab: {
    tabs: TabName[];
    currentTab: TabName;
  };
  markdownText: string;
}

class App extends Component<{}, AppState> {
  private onChange: (data: string) => Promise<string>;

  constructor() {
    super({});
    this.state = {
      tab: {
        currentTab: "Editor",
        tabs: ["Editor", "View", "Export"],
      },
      markdownText: "",
    };

    this.onChange = debounce((data: string) => {
      return prettier.format(data, {
        parser: "markdown",
        tabWidth: 2,
        plugins: [markdownParser],
      });
    }, 1000 * 5);
  }

  private tabContents(): h.JSX.Element | null {
    const {
      markdownText,
      tab: { currentTab },
    } = this.state;

    switch (currentTab) {
      case "Editor":
        return (
          <Editor
            tabWidth={4}
            value={markdownText}
            onChange={(value): void => {
              this.setState({ markdownText: value });
              this.onChange(value).then((formatted) => {
                this.setState({ markdownText: formatted });
              });
            }}
          />
        );
      case "View":
        return <Preview markdown={markdownText} />;
      case "Export":
        return <Export markdown={markdownText} />;
      default:
        return null;
    }
  }

  render(): h.JSX.Element {
    const {
      tab: { tabs, currentTab },
    } = this.state;

    return (
      <div id="app">
        <Tabs
          active={currentTab}
          tabs={tabs}
          onTabChange={(tab): void =>
            this.setState({
              tab: { ...this.state.tab, currentTab: tab as TabName },
            })
          }
        />
        {this.tabContents()}
      </div>
    );
  }
}

// TODO - Separate file
render(<App />, document.body);
initialiseApp();
