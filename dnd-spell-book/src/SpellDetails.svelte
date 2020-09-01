<script lang="ts">
  /**
   * Full display of a spell and all its metadata
   */
  import Markdown from "./Markdown.svelte";

  export let spell: SpellDetails;

  interface SpellDetails {
    name: string;
    description: string;
    higherLevel: string;
    range: string;
    castingTime: string;
    pages: Array<{
      pageNumber: number;
      book: string;
    }>;
    components: string[];
    material: string | null;
    duration: string;
    school: string;
    level: number;
    knownBy: string[];
    ritual: boolean;
    concentration: boolean;
    aliases: string[];
    license: Array<{ link: string; text: string }>;
  }

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

<h1>{spell.name}</h1>

{#if spell.aliases.length > 0}
  <p>Also Known As {spell.aliases.map((a) => `"${a}"`).join(', ')}</p>
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
      <li>{source}</li>
    {/each}
  </ul>
{/if}

{#if spell.pages.length > 0}
  <h2>This Spell is From</h2>
  {#each spell.pages as page}
    <p>{page.book}, page {page.pageNumber}</p>
  {/each}
{/if}

{#each spell.license as license}<a href={license.link}>{license.text}</a>{/each}
