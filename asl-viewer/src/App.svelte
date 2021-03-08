<script lang="ts">
  import Mermaid from "./mermaid.svelte";
  import convert from "./asl-to-mermaid";

  let input = JSON.stringify(
    {
      StartAt: "startState",
      States: {
        startState: {
          Type: "Task",
          Resource: "arn:id",
          Next: "wait",
        },
        wait: {
          Type: "Wait",
          Seconds: 3,
          Next: "finishState",
        },
        finishState: {
          Type: "Succeed",
        },
      },
    },
    null,
    2
  );

  let mermaidText: string;
  $: try {
    mermaidText = convert(JSON.parse(input));
  } catch (e) {
    mermaidText = undefined;
  }
</script>

<main>
  <textarea bind:value={input} />
  {#if mermaidText}
    <Mermaid contents={mermaidText} />
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    height: 90%;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  main > * {
    width: 40%;
    height: 95%;
    display: inline-block;
  }

  textarea {
    resize: none;
  }
</style>
