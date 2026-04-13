export type PacingPreference = "slow" | "balanced" | "fast";

export function computePacingPreference(signal: {
  avgWatchTimeRatio: number;
}): PacingPreference {
  if (signal.avgWatchTimeRatio > 0.8) return "slow";
  if (signal.avgWatchTimeRatio < 0.4) return "fast";
  return "balanced";
}
