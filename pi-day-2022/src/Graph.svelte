<script lang="ts">
  import vegaEmbed from "vega-embed";
  import type { PiEvent } from "./calculations/pi-calculations";

  export let data: PiEvent[] = [];
  let hostElement: HTMLElement;

  $: {
    if (hostElement) {
      vegaEmbed(hostElement, {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A scatter plot of coloured circles vs pi",
        data: {
          values: data,
        },
        mark: "point",
        encoding: {
          x: {
            field: "coloured",
            type: "quantitative",
          },
          y: {
            field: "pi",
            type: "quantitative",
          },
        },
      });
    }
  }
</script>

<div bind:this={hostElement} />
