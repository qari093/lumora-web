export const tuningSystems = [
  "fyp-balancing",
  "oracle-tuning",
  "engagement-analysis",
  "emotional-diversity",
  "watch-conversion",
] as const;

export function calculateConversion(watches: number, clicks: number) {
  if (clicks <= 0) return 0;
  return Number((watches / clicks).toFixed(2));
}

export function emotionalBalance(active: boolean) {
  return active;
}
