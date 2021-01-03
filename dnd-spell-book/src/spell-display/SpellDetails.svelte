<script lang="ts">
  /**
   * Full display of a spell and all its metadata
   */
  import Markdown from "./Markdown.svelte";
  import type { FullSpell } from "../spell-data/spell-types";
  import { getName } from "../spell-data/get-spell-name";

  export let spell: FullSpell;

  $: components =
    spell.components
      .sort((a, b) => b.localeCompare(a))
      .map((symbol: string) => {
        switch (symbol) {
          case "V":
            return "Verbal";
          case "S":
            return "Somatic";
          case "M":
            return "Material";
          default:
            return symbol;
        }
      })
      .join(", ") + (spell.material ? ` (${spell.material})` : "");

  $: spellName = getName(spell);
  $: aliases = spell.names
    .filter((alias) => alias.name !== spellName)
    .map((alias) => alias.name)
    .sort();
  $: sourcePages = spell.names
    .map((name) => `${name.bookName}, page ${name.pageNumber}`)
    .sort();
</script>

<style>
  table {
    margin: 0 auto;
    text-align: left;
  }

  th,
  td {
    padding: 0.3em;
  }
</style>

<h1>{spellName}</h1>

{#if aliases.length > 1}
  <p>Also Known As {aliases.map((a) => `"${a}"`).join(', ')}</p>
{/if}

<table>
  <tbody>
    <tr>
      <th>Level</th>
      <td>{spell.level || 'Cantrip'}</td>
    </tr>
    <tr>
      <th>Casting Time</th>
      <td>{spell.castingTime}</td>
    </tr>
    <tr>
      <th>Duration</th>
      <td>{spell.duration}</td>
    </tr>
    <tr>
      <th>Concentration</th>
      <td>{spell.concentration ? 'Yes' : 'No'}</td>
    </tr>
    <tr>
      <th>School</th>
      <td>{spell.school}</td>
    </tr>
    <tr>
      <th>Range</th>
      <td>{spell.range}</td>
    </tr>
    <tr>
      <th>Components</th>
      <td>{components}</td>
    </tr>
    <tr>
      <th>Ritual</th>
      <td>{spell.ritual ? 'Yes' : 'No'}</td>
    </tr>
  </tbody>
</table>

<Markdown text={spell.description} />

{#if spell.higherLevel}
  <h2>At a Higher Level</h2>
  <Markdown text={spell.higherLevel} />
{/if}

{#if spell.knownBy.length > 0}
  <h2>Known By</h2>
  <ul>
    {#each spell.knownBy as source}
      <li>{source.name}</li>
    {/each}
  </ul>
{/if}

<h2>This Spell is From</h2>
{#each sourcePages as sourcePage}
  <p>{sourcePage}</p>
{/each}

<h2>Data License</h2>
{#each spell.license as license}
  <Markdown text={license} />
{/each}
