<script lang="ts">
  import marked from "marked";
  export let text = "";
</script>

<style>
  :global(.md table) {
    margin: 0 auto;
    border-collapse: collapse;
  }

  :global(.md th, .md td) {
    padding: 0.3em;
  }

  :global(.md th) {
    background-color: #089e21;
    color: #efefef;
  }
</style>

<div class="md">
  {@html marked(text)}
</div>
