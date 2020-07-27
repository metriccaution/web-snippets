<script lang="ts">
  /**
   * Super-basic UI for choosing start / end dates for the main app
   */
  import Picker from "./Picker.svelte";
  import { setDate, setTime } from "./times";

  let start = Date.now();
  let end = Date.now() + 1000 * 60;

  const countdowns = [
    {
      name: "Today",
      start: setTime(0, 0, 0, new Date()).getTime(),
      end: setTime(23, 59, 59, new Date()).getTime(),
    },
    {
      name: "This Year",
      start: setDate(1, 1, setTime(0, 0, 0, new Date())).getTime(),
      end: setDate(12, 31, setTime(23, 59, 59, new Date())).getTime(),
    },
    {
      name: "The year 3000, starting from the release of the Busted single",
      start: new Date("2003-01-13T00:00:00.000Z").getTime(),
      end: new Date("3000-01-01T00:00:00.000Z").getTime(),
    },
    {
      name: "Brexit transition period",
      start: new Date("2020-01-31T23:00:00.000Z").getTime(),
      end: new Date("2020-12-31T23:59:59.999Z").getTime(),
    },
    {
      name: "Average human lifespan, starting now",
      start: Date.now(),
      end: Date.now() + (1000 * 60 * 60 * 24 * 365.25 * 79)
    }
  ];
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

  ol {
    width: 240px;
    margin: 0 auto;
    text-align: left;
  }
</style>

<main>
  <h1>Create Your Countdown</h1>
  <p>
    Pick the start and end of your countdown, or pick one from the list below
  </p>
  <p>
    <Picker
      label="Start"
      on:date-change={(e) => (start = e.detail.value)}
      time={start} />
  </p>
  <p>
    <Picker
      label="End"
      on:date-change={(e) => (end = e.detail.value)}
      time={end} />
  </p>
  <p>
    <a href={`?start=${start}&end=${end}`}>Go!</a>
  </p>

  <ol>
    {#each countdowns as { name, start, end }}
      <li>
        <a href={`?start=${start}&end=${end}`}>{name}</a>
      </li>
    {/each}
  </ol>
</main>
