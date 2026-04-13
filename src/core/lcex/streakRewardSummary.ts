export type StreakRewardSummaryInput = {
  userId: string;
  currentStreakDays: number;
  longestStreakDays: number;
  rewardsGranted: number;
  nextRewardTier: number;
  lastRewardAt?: string;
};

export type StreakRewardSummary = {
  userId: string;
  summaryLine: string;
  milestoneLine: string;
  healthy: boolean;
};

export function buildStreakRewardSummary(
  input: StreakRewardSummaryInput
): StreakRewardSummary {
  const current = Math.max(0, Math.round(input.currentStreakDays));
  const longest = Math.max(0, Math.round(input.longestStreakDays));
  const granted = Math.max(0, Math.round(input.rewardsGranted));
  const nextTier = Math.max(0, Math.round(input.nextRewardTier));

  return {
    userId: input.userId.trim(),
    summaryLine: `${current} day streak • ${granted} rewards granted`,
    milestoneLine: `Longest ${longest} days • next reward at ${nextTier} days`,
    healthy: current > 0 && nextTier >= current,
  };
}

export function hasHealthyStreakRewardProgress(
  summary: StreakRewardSummary
): boolean {
  return summary.healthy;
}
