<script lang="ts">
  /**
   * Summary of a spell - Intended to be displayed in a big old list
   */

  export let spell: SpellSummary;
  export let active: boolean;

  interface SpellSummary {
    name: string;
    components: string[];
    level: number;
    school: string;
  }

  $: level =
    spell.level === 0
      ? `${spell.school} cantrip`
      : `${spell.school}, ${spell.level}`;
  $: text = ["", level, spell.components.sort().join(", ")].join("\n\n");
</script>

<style>
  button {
    display: block;
    width: 273px;
    padding: 1em;
    white-space: pre-wrap;
    margin: 0.5em auto;
    background-color: #25C440;
    box-shadow: 0px 3px 10px #333;
  }

  .active {
    background-color: #089E21;
    color: #efefef;
  }
</style>

<button class="spell_summary" on:click class:active on:click>
  <b>{spell.name}</b>
  {text}
</button>
