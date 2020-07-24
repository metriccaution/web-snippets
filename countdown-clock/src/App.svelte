<script lang="ts">
  import parseParams from "./parse-params";
  import Countdown from "./countdown/Index.svelte";
  import PickTimes from "./pick-times/Index.svelte";
  const timings = parseParams();
</script>

{#if timings}
  <Countdown {...timings} />
{:else}
  <PickTimes />
{/if}
