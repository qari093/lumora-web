export type EchoFootprint = {
  present: number;
  stillness: number;
  hold: number;
  rewatch: number;
  silentOvation: number;
  label: string; // neutral, non-judgmental
};

export function buildEchoFootprint(input: {
  present: number;
  stillness: number;
  hold: number;
  rewatch: number;
  silentOvation: number;
}): EchoFootprint {
  const parts = [
    input.present ? `${input.present} present` : "",
    input.stillness ? `${input.stillness} still` : "",
    input.hold ? `${input.hold} held` : "",
    input.rewatch ? `${input.rewatch} returned` : "",
    input.silentOvation ? `${input.silentOvation} ovation` : "",
  ].filter(Boolean);

  return {
    present: input.present,
    stillness: input.stillness,
    hold: input.hold,
    rewatch: input.rewatch,
    silentOvation: input.silentOvation,
    label: parts.join(", ") || "quiet echo",
  };
}
