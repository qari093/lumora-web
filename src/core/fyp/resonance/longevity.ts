export type LongevitySignal = {
  contentId: string;
  ageHours: number;
  replayAfter48h: number;
  recurringSaves: number;
};

export function calculateLongevityWeight(
  signal: LongevitySignal
): number {
  return (
    signal.replayAfter48h * 4 +
    signal.recurringSaves * 6 +
    Math.min(signal.ageHours / 24, 14)
  );
}

export function qualifiesForLegacyRotation(
  signal: LongevitySignal
): boolean {
  return calculateLongevityWeight(signal) >= 40;
}
