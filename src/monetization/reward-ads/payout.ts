export function calculateRewardAdPayout(input: {
  completed: boolean;
  baseRewardZen?: number;
  qualityMultiplier?: number;
}) {
  if (!input.completed) {
    return { amount: 0, reason: "reward_ad_not_completed" };
  }

  const base = input.baseRewardZen ?? 5;
  const multiplier = input.qualityMultiplier ?? 1;

  return {
    amount: Math.max(0, Math.round(base * multiplier)),
    reason: "reward_ad_completed",
  };
}
