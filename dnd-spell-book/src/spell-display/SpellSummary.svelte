<script lang="ts">
  /**
   * Summary of a spell - Intended to be displayed in a big old list
   */
  import type { FullSpell } from "../spell-data/spell-types";
  import { getName } from "../spell-data/get-spell-name";

  export let spell: FullSpell;
  export let active: boolean;

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
    background-color: #9db4c0;
    box-shadow: 0px 3px 10px #333;
  }

  .active {
    background-color: #5c6b73;
    color: #efefef;
  }
</style>

<button class="spell_summary" on:click class:active on:click>
  <b>{getName(spell)}</b>
  {text}
</button>
