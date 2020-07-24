<script lang="ts">
  export let progress = 0;

  let widthStyle = "width: 0%";
  $: widthStyle =
    "width: " + Math.floor(Math.max(0, Math.min(1, progress)) * 100) + "%";
</script>

<style>
  div {
    height: 1em;
  }

  .container {
    border: 1px solid #000;
    width: 100%;
  }

  .progress {
    background-color: #999;
  }
</style>

<div class="container">
  <div class="progress" style={widthStyle} />
</div>
