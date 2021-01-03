<script lang="ts">
  import { rawSpells, searchTerm, filteredSpells } from "./spell-data/store";
  import { getName } from "./spell-data/get-spell-name";
  import SpellDetails from "./spell-display/SpellDetails.svelte";
  import SpellSummary from "./spell-display/SpellSummary.svelte";

  let currentSpellName = "";

  $: if (!currentSpellName && $filteredSpells.length > 0) {
    currentSpellName = getName($filteredSpells[0]);
  }
  $: currentSpell = $filteredSpells.find(
    (s) => getName(s) === currentSpellName
  );

  fetch("raw-data/srd.json")
    .then((spells) => spells.json())
    .then((spells) => rawSpells.set(spells))
    // TODO - Error display
    .catch((e) => console.log("Error fetching spells", e));
</script>

<style>
  main {
    height: 100%;
  }

  .container {
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .container > div {
    height: 100%;
    overflow: auto;
  }

  .left {
    flex-grow: 0;
    flex-shrink: 0;
    width: 300px;
  }

  .left input {
    width: 284px;
    padding: 0.5em 0em;
    border: 1px #333 solid;
    box-shadow: 0px 3px 10px #333;
  }

  .left > .search_container {
    height: 5%;
  }

  .left > .summary_container {
    height: 95%;
    overflow: scroll;
  }

  .right {
    margin: 0em 2em;
  }
</style>

<main>
  <div class="container">
    <div class="left">
      <div class="search_container">
        <input type="text" bind:value={$searchTerm} />
      </div>
      <div class="summary_container">
        {#each $filteredSpells as spell (spell.names[0])}
          <SpellSummary
            {spell}
            active={currentSpellName === getName(spell)}
            on:click={() => (currentSpellName = getName(spell))} />
        {/each}
      </div>
    </div>
    <div class="right">
      {#if currentSpell}
        <SpellDetails spell={currentSpell} />
      {/if}
    </div>
  </div>
</main>
