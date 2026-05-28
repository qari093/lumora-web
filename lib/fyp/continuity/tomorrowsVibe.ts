export type TomorrowsVibe = {
  text: string;
  pressureFree: boolean;
};

export function createTomorrowsVibe(text = "Something quiet is forming."): TomorrowsVibe {
  return { text, pressureFree: true };
}
