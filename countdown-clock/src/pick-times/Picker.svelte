<script lang="ts">
  /**
   * A very primitive date picker
   */
  export let label: string;
  export let time: number = 0;

  let formattedTime: string;
  $: formattedTime = new Date(time).toISOString();

  let valid = true;

  function textChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = new Date(target.value);
    valid = !isNaN(value.getTime());
    if (valid) {
      time = value.getTime();
    }
  }
</script>

<label>
  {label}
  <input on:change={textChange} type="text" value={formattedTime} />
  {#if !valid}:({/if}
</label>
