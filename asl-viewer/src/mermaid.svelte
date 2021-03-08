<script lang="ts" context="module">
  import mermaidAPI from "mermaid";
  mermaidAPI.initialize({
    startOnLoad: false,
  });

  let graphs = 0;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  export let contents: string;
  let mounted = false;

  let uniqueId = `mermaid-graph-${graphs++}`;
  let output : HTMLElement;
  let innerValue = "";

  $: if (mounted && contents) {
    update();
  }

  function update() {
    mermaidAPI.render(uniqueId, contents, function(svgCode) {
      innerValue = svgCode;
    });
  }

  onMount(() => {
    mounted = true;
  });
</script>

<div class="mermaid-diagram">
  <div id={uniqueId} bind:this={output} />
  <div>{@html innerValue}</div>
</div>

<style>
  .mermaid-diagram {
    display: inline-block;
    background-color: #efefef;
    vertical-align: top;
    overflow-y: scroll;
    /* TODO - Cascade this properly */
    width: 40%;
    max-width: 40%;
    height: 95%;
  }
</style>
