/**
 * Hacky glue to turn a ASL spec into a Mermaid state diagram block
 */

import type {
  Choice,
  Map,
  Parallel,
  Pass,
  StateMachine,
  Task,
  Wait,
} from "asl-types";

type Graph = {
  aliases: Record<string, string>;
  links: Array<Link | Subgraph | Paralell>;
};

interface Link {
  type: "link";
  from: string;
  to: string;
  description: string;
}
interface Subgraph {
  type: "subgraph";
  name: string;
  graph: Graph;
}
interface Paralell {
  type: "paralell";
  name: string;
  graphs: Graph[];
}

// TODO - Comments as notes?

export default (stateMachine: StateMachine): string => {
  const state = parseGraph(stateMachine);
  return "stateDiagram-v2\n" + renderGraph(state);
};

/**
 * Parse the graph of the ASL into something designed for easy rendering
 */
function parseGraph(
  stateMachine: StateMachine,
  idPrefix: string = "State",
): Graph {
  const graph: Graph = {
    aliases: {
      "null": "[*]",
    },
    links: [],
  };

  const alias = (name: string | null): string => {
    const key = `${name}`;
    if (!graph.aliases[key]) {
      graph.aliases[key] = `${idPrefix}_${Object.keys(graph.aliases).length}`;
    }

    return graph.aliases[key];
  };

  const addEntry = (
    source: string | null,
    sink: string | null,
    description: string,
  ) => {
    graph.links.push({
      type: "link",
      from: alias(source),
      to: alias(sink),
      description,
    });
  };

  // Consume the state spec

  addEntry(null, stateMachine.StartAt, "Initialise");

  for (const [stateName, state] of Object.entries(stateMachine.States)) {
    switch (state.Type) {
      case "Task": {
        const task = state as Task;
        if (task.End) {
          addEntry(stateName, null, "Finish");
        }

        if (task.Next) {
          addEntry(stateName, task.Next, "Next");
        }

        if (task.Catch) {
          for (const c of task.Catch) {
            addEntry(stateName, c.Next, `Error - ${c.ErrorEquals.join(", ")}`);
          }
        }

        break;
      }
      case "Choice": {
        const choice = state as Choice;
        if (choice.Default) {
          addEntry(stateName, choice.Default, "Default");
        }
        for (const c of choice.Choices) {
          addEntry(stateName, c.Next, "Choice");
        }
        break;
      }
      case "Wait": {
        const wait = state as Wait;
        addEntry(stateName, wait.Next, "Wait");
        break;
      }
      case "Succeed": {
        addEntry(stateName, null, "Success");
        break;
      }
      case "Fail": {
        addEntry(stateName, null, "Failure");
        break;
      }
      case "Pass": {
        const pass = state as Pass;
        if (pass.End) {
          addEntry(stateName, null, "Finish");
        }

        if (pass.Next) {
          addEntry(stateName, pass.Next, "Next");
        }

        break;
      }
      case "Map": {
        const map = state as Map;
        graph.links.push({
          type: "subgraph",
          name: alias(stateName), // TODO - Something unique, but human readable
          graph: parseGraph(map.Iterator, `${alias(stateName)}_Iterator`),
        });

        if (map.Catch) {
          for (const c of map.Catch) {
            addEntry(stateName, c.Next, `Error - ${c.ErrorEquals.join(", ")}`);
          }
        }

        if (map.End) {
          addEntry(stateName, null, "Finish");
        }

        if (map.Next) {
          addEntry(stateName, map.Next, "Next");
        }
        break;
      }
      case "Parallel": {
        const parallel = state as Parallel;
        const graphs = parallel.Branches
          .map((branch, index) => parseGraph(branch, `${idPrefix}x${index}`));
        graph.links.push({
          type: "paralell",
          name: alias(stateName), // TODO - Something unique, but human readable
          graphs,
        });

        if (parallel.Catch) {
          for (const c of parallel.Catch) {
            addEntry(stateName, c.Next, `Error - ${c.ErrorEquals.join(", ")}`);
          }
        }

        if (parallel.End) {
          addEntry(stateName, null, "Finish");
        }

        if (parallel.Next) {
          addEntry(stateName, parallel.Next, "Next");
        }
        break;
      }
      default:
        throw new Error(`Couldn't handle ASL node with type ${state.Type}`);
    }
  }

  return graph;
}

/**
 * Render a parsed graph to Mermaid text 
 */
function renderGraph(graph: Graph, indent = 2): string {
  const prefix = new Array(indent).fill(" ").join("");
  let results = [
    ...Object.entries(graph.aliases)
      .filter(([expanded]) => expanded !== "null")
      .map(([expanded, alias]) => `${prefix}state "${expanded}" as ${alias}`),
    ...graph.links.map((link) => {
      switch (link.type) {
        case "link":
          return `${prefix}${link.from} --> ${link.to} : ${link.description}`;

        case "subgraph":
          return [
            `${prefix}state ${link.name} {`,
            renderGraph(link.graph, indent + 2),
            `${prefix}}`,
          ].join("\n");

        case "paralell":
          return [
            `${prefix}state ${link.name} {`,
            link.graphs.map((graph) => renderGraph(graph, indent + 2)).join(
              `\n${prefix}  --`,
            ),
            `${prefix}}`,
          ].join("\n");

        default:
          throw new Error(`Unknown link type ${JSON.stringify(link)}`);
      }
    }),
  ].join("\n");

  // Mermaid takes issue with giving pretty names to composite state blocks
  // This section removes the initial declaration of any of these
  const declarationsToRemove: string[] = Array.from(
    results.matchAll(/\s*state (.*?) \{$/mg),
  )
    .map((match) => {
      if (!match[1]) {
        throw new Error("");
      }

      return match[1];
    });

  return declarationsToRemove.reduce(
    (text, declaration) =>
      text.replace(new RegExp(`\\s+state ".*?" as ${declaration}$`, "igm"), ""),
    results,
  );
}
