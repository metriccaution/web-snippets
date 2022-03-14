<script lang="ts">
  import Calculation from "./Calculation.svelte";
  import Markdown from "./Markdown.svelte";
  import RegularCircleCalculation from "./calculations/RegularCircleCalculation.svelte";
  import SingleLineCalculation from "./calculations/SingleLineCalculation.svelte";
  import NestedCircleCalculation from "./calculations/NestedCircleCalculation.svelte";

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

  const circleSize = 400;
  const maxRadius = circleSize / 2;

  $: singleLinePi = 0;
  const updateSingleLinePi = (event: CustomEvent<PiEvent>) => {
    singleLinePi = event.detail.pi;
  };

  $: innerRadius = 100;
  $: nestedCirclesPi = 0;
  const updateNestedCirclePi = (event: CustomEvent<PiEvent>) => {
    nestedCirclesPi = event.detail.pi;
  };

  $: singleCirclePi = 0;
  const updateSingleCirclePi = (event: CustomEvent<PiEvent>) => {
    singleCirclePi = event.detail.pi;
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
</main>

<style>
  main {
    text-align: center;
  }
</style>
