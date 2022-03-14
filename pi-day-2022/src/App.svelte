<script lang="ts">
  import Calculation from "./Calculation.svelte";
  import Markdown from "./Markdown.svelte";
  import RegularCircleCalculation from "./calculations/RegularCircleCalculation.svelte";
  import SingleLineCalculation from "./calculations/SingleLineCalculation.svelte";
  import NestedCircleCalculation from "./calculations/NestedCircleCalculation.svelte";
  import { estimates } from "./estimation-store";
  import {
    intro,
    singleLine,
    singleLineReport,
    nestedDescription,
    nestedCirclesReport,
    singleCircleDescription,
    singleCircleReport,
    conclusion,
  } from "./text";
  import type { PiEvent } from "./calculations/pi-calculations";
  import Graph from "./Graph.svelte";

  const circleSize = 400;
  const maxRadius = circleSize / 2;

  $: singleLinePi = 0;
  const updateSingleLinePi = (event: CustomEvent<PiEvent>) => {
    singleLinePi = event.detail.pi;
    estimates.update((v) => v.concat([event.detail]));
  };

  $: innerRadius = 100;
  $: nestedCirclesPi = 0;
  const updateNestedCirclePi = (event: CustomEvent<PiEvent>) => {
    nestedCirclesPi = event.detail.pi;
    estimates.update((v) => v.concat([event.detail]));
    // estimates.update((value) => {
    //   console.log(value);
    //   return [];
    // });
  };

  $: singleCirclePi = 0;
  const updateSingleCirclePi = (event: CustomEvent<PiEvent>) => {
    singleCirclePi = event.detail.pi;
    estimates.update((v) => v.concat([event.detail]));
  };
</script>

<main>
  <Markdown markdown={intro} />

  <Calculation>
    <span slot="preamble">
      <Markdown markdown={singleLine} />
    </span>
    <span slot="diagram">
      <SingleLineCalculation
        on:calculation={updateSingleLinePi}
        size={circleSize}
        radius={maxRadius}
      />
    </span>
    <span slot="report">
      {singleLineReport(singleLinePi)}
    </span>
  </Calculation>

  <Calculation>
    <span slot="preamble">
      <Markdown markdown={nestedDescription} />
    </span>
    <span slot="diagram">
      <div>
        <input
          type="range"
          bind:value={innerRadius}
          min="15"
          max={`${maxRadius - 5}`}
        />
      </div>
      <NestedCircleCalculation
        on:calculation={updateNestedCirclePi}
        size={circleSize}
        {innerRadius}
        outerRadius={maxRadius}
      />
    </span>
    <span slot="report">
      {nestedCirclesReport(nestedCirclesPi)}
    </span>
  </Calculation>

  <Calculation>
    <span slot="preamble">
      <Markdown markdown={singleCircleDescription} />
    </span>
    <span slot="diagram">
      <RegularCircleCalculation
        on:calculation={updateSingleCirclePi}
        size={circleSize}
        radius={maxRadius}
      />
    </span>
    <span slot="report">
      {singleCircleReport(singleCirclePi)}
    </span>
  </Calculation>

  <Markdown markdown={conclusion} />
  <Graph data={$estimates} />
</main>

<style>
  main {
    text-align: center;
  }
</style>
