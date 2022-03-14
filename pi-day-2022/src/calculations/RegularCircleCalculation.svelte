<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { countPixels } from "./canvas-utils";
  import { circleApproximation } from "./pi-calculations";

  const dispatch = createEventDispatcher();

  export let size: number;
  export let radius: number;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d");

    const x = Math.floor(canvas.width / 2);
    const y = Math.floor(canvas.height / 2);

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill("evenodd");

    dispatch("calculation", circleApproximation(countPixels(canvas), radius));
  });
</script>

<canvas bind:this={canvas} width={size} height={size} />

<style>
  canvas {
    height: 100%;
  }
</style>
