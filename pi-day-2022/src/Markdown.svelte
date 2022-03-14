<script lang="ts">
  import { marked } from "marked";

  export let markdown: string;
</script>

<div>
  {@html marked(markdown)}
</div>

<style>
  div {
    margin: auto 20%;
  }
</style>
