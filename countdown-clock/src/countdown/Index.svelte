<script lang="ts">
  import ProgressBar from "./ProgressBar.svelte";
  import DigitalCountdown from "./DigitalCountdown.svelte";

  export let start: number;
  export let end: number;

  let now = Date.now();
  let timeRemaining = 0;
  let percentRemaining = 0;

  $: timeRemaining = Math.max(0, end - now);
  $: percentRemaining = timeRemaining / (end - start) || 0;

  setInterval(() => (now = Date.now()), 42);
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .progress_container {
    width: 240px;
    margin: 0 auto;
  }
</style>

<main>
  <p>
    <DigitalCountdown ms={timeRemaining} />
  </p>
  <p>{timeRemaining}</p>
  <p>{(percentRemaining * 100).toFixed(6)}%</p>
  <p class="progress_container">
    <ProgressBar progress={percentRemaining} />
  </p>
</main>
