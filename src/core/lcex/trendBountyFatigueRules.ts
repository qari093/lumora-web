export type TrendBountyFatigueInput = {
  impressionsLast24h: number;
  opensLast24h: number;
  submissionsLast24h: number;
  dismissalsLast24h: number;
  hidesLast24h: number;
  repeatExposureRate: number;
};

export type TrendBountyFatigueDecision = {
  fatigued: boolean;
  fatigueScore: number;
  tier: "none" | "watch" | "high" | "critical";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveTrendBountyFatigue(
  input: TrendBountyFatigueInput
): TrendBountyFatigueDecision {
  const engagementResistance =
    input.impressionsLast24h <= 0
      ? 0
      : Math.max(
          0,
          100 -
            ((input.opensLast24h + input.submissionsLast24h * 2) /
              input.impressionsLast24h) *
              100
        );

  const fatigueScore = clampScore(
    engagementResistance * 0.4 +
      Math.min(input.dismissalsLast24h * 4, 100) * 0.2 +
      Math.min(input.hidesLast24h * 5, 100) * 0.2 +
      input.repeatExposureRate * 0.2
  );

  return {
    fatigued: fatigueScore >= 55,
    fatigueScore,
    tier:
      fatigueScore >= 85
        ? "critical"
        : fatigueScore >= 70
        ? "high"
        : fatigueScore >= 55
        ? "watch"
        : "none",
  };
}

export function shouldThrottleTrendBounty(
  input: TrendBountyFatigueInput
): boolean {
  return resolveTrendBountyFatigue(input).fatigued;
}
