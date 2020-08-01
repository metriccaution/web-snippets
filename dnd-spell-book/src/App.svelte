<script lang="ts">
  import {
    rawSpells,
    searchTerm,
    filteredSpells,
  } from "./spell-data/spell-store";
  import SpellDetails from "./SpellDetails.svelte";
  import SpellSummary from "./SpellSummary.svelte";

  let currentSpellName = "";

  $: if (!currentSpellName && $filteredSpells.length > 0) {
    currentSpellName = $filteredSpells[0].name;
  }
  $: currentSpell = $filteredSpells.find((s) => s.name === currentSpellName);

  fetch("raw-data/srd.json")
    // fetch("raw-data/all.json") // TODO
    .then((spells) => spells.json())
    .then((spells) => rawSpells.set(spells))
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

  .right {
    margin: 0em 2em;
  }
</style>

<main>
  <div class="container">
    <div class="left">
      <input bind:value={$searchTerm} />
      {#each $filteredSpells as spell (spell.name)}
        <SpellSummary
          {spell}
          active={currentSpellName === spell.name}
          on:click={() => (currentSpellName = spell.name)} />
      {/each}
    </div>
    <div class="right">
      {#if currentSpell}
        <SpellDetails spell={currentSpell} />
      {/if}
    </div>
  </div>
</main>
