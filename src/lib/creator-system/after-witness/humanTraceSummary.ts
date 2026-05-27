export type HumanTraceSummary = {
  text: string;
  interpretationText: false;
};

export function buildHumanTraceSummary(input: {
  present: number;
  stillness: number;
  hold: number;
  rewatch: number;
  silentOvation: number;
}): HumanTraceSummary {
  const parts = [
    input.present ? `${input.present} present` : "",
    input.stillness ? `${input.stillness} still` : "",
    input.hold ? `${input.hold} held` : "",
    input.rewatch ? `${input.rewatch} returned` : "",
    input.silentOvation ? `${input.silentOvation} ovation` : "",
  ].filter(Boolean);

  return {
    text: parts.join(", ") || "A quiet trace remained",
    interpretationText: false,
  };
}
