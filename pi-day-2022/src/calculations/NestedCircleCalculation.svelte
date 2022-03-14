<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { countPixels } from "./canvas-utils";
  import { nestedCircleApproximation } from "./pi-calculations";

  const dispatch = createEventDispatcher();

  export let size: number;
  export let innerRadius: number;
  export let outerRadius: number;

  let canvas: HTMLCanvasElement;

  $: {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const x = Math.floor(canvas.width / 2);
      const y = Math.floor(canvas.height / 2);

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
      ctx.arc(x, y, innerRadius, 0, 2 * Math.PI);
      ctx.fill("evenodd");

      dispatch(
        "calculation",
        nestedCircleApproximation(countPixels(canvas), innerRadius, outerRadius)
      );
    }
  }
</script>

<canvas bind:this={canvas} width={size} height={size} />

<style>
  canvas {
    height: 100%;
  }
</style>
