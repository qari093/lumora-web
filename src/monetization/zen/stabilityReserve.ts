export function calculateStabilityReward(input: {
  revenuePerUser: number;
  targetRevenuePerUser: number;
  reserveBalance: number;
  maxReward?: number;
}) {
  if (input.reserveBalance <= 0) return 0;
  if (input.revenuePerUser >= input.targetRevenuePerUser) return 0;

  const maxReward = input.maxReward ?? 25;
  const gapRatio =
    (input.targetRevenuePerUser - input.revenuePerUser) /
    Math.max(input.targetRevenuePerUser, 0.0001);

  return Math.min(input.reserveBalance, Math.round(maxReward * gapRatio));
}
