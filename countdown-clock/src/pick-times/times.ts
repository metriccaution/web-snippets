export const setTime = (
  hours: number,
  minutes: number,
  seconds: number,
  time: Date
): Date => {
  const copy = new Date(time);

  copy.setHours(hours);
  copy.setMinutes(minutes);
  copy.setSeconds(seconds);
  copy.setMilliseconds(0);

  return copy;
};

export const setDate = (month: number, date: number, time: Date): Date => {
  const copy = new Date(time);

  copy.setMonth(month - 1);
  copy.setDate(date);

  return copy;
};
