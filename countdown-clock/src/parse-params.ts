export interface Timing {
  start: number;
  end: number;
}

/**
 * Check the page's URL, and if both a start and end time are set.
 */
export default (): Timing | null => {
  const timings: Partial<Timing> = {};

  for (let [key, value] of new URLSearchParams(window.location.search)) {
    switch (key) {
      case "start":
      case "end":
        const timestamp = parseInt(value, 10);
        if (!isNaN(timestamp)) {
          timings[key] = timestamp;
        }
        break;
    }
  }

  if (timings.start && timings.end) {
    return timings as Timing;
  }

  return null;
};
