export function calculatePulseRoyalty(input: {
  inclusions: number;
  voltageAverage: number;
}): number {
  return Number((input.inclusions * 0.5 + input.voltageAverage * 0.02).toFixed(2));
}

export function calculateGutCheckPayout(input: {
  dailyInclusions: number;
  strongestClipWins: number;
}): number {
  return Number((input.dailyInclusions * 0.75 + input.strongestClipWins * 1.25).toFixed(2));
}

export function calculateRelicLicense(input: {
  relicClaims: number;
  engagementValue: number;
}): number {
  return Number((input.relicClaims * 0.04 + input.engagementValue * 0.05).toFixed(2));
}
