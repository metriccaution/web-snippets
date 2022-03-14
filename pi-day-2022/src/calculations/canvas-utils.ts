const chunk = <T>(size: number, arr: T[]): T[][] => {
  const ret = [];
  for (let x = 0; x < arr.length; x += size) {
    ret.push(arr.slice(x, x + size));
  }

  return ret;
};

/**
 * Count how many pixels of a canvas have something in that isn't a pure-white background
 */
export const countPixels = (canvas: HTMLCanvasElement): number => {
  const ctx = canvas.getContext("2d");
  const coloursArray = Array.from(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data,
  );
  return chunk(3, coloursArray).filter((rgb) => rgb.some((c) => c > 0)).length;
};
