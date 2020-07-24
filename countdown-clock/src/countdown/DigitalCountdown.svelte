<script lang="ts">
  /**
   * Time components - Digital clock style
   */
  export let ms = 0;

  const oneSecond = 1000;
  const oneMinute = 1000 * 60;
  const oneHour = 1000 * 60 * 60;
  const oneDay = 1000 * 60 * 60 * 24;

  const leftPad = (length: number, padWith: string, text: unknown): string => {
    let ret = "" + text;
    while (ret.length < length) {
      ret = padWith + ret;
    }

    return ret;
  };

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  $: days = Math.floor(ms / oneDay);
  $: hours = Math.floor((ms - days * oneDay) / oneHour);
  $: minutes = Math.floor((ms - days * oneDay - hours * oneHour) / oneMinute);
  $: seconds = Math.floor(
    (ms - days * oneDay - hours * oneHour - minutes * oneMinute) / oneSecond
  );
</script>

<style>

</style>

{days}:{leftPad(2, '0', hours)}:{leftPad(2, '0', minutes)}:{leftPad(2, '0', seconds)}
