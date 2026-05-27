export type FraudSignalProfile = {
  repeatedPatternScore: number;
  impossibleWatchVelocity: number;
  deviceRiskScore: number;
  rewardClaimVelocity: number;
};

export function calculateAnomalyScore(profile: FraudSignalProfile) {
  const score =
    profile.repeatedPatternScore * 0.3 +
    profile.impossibleWatchVelocity * 0.3 +
    profile.deviceRiskScore * 0.2 +
    profile.rewardClaimVelocity * 0.2;

  return Math.max(0, Math.min(1, score));
}
