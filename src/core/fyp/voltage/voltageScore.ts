export type VoltageMetrics = {
  instantReplayRate: number;
  scrollStopRate: number;
  shareVelocity: number;
  firstSixSecondRetention: number;
};

export type VoltageScore = {
  score: number;
  tier: "stable" | "charged" | "surging" | "nuclear";
};

export function calculateVoltageScore(
  metrics: VoltageMetrics
): VoltageScore {
  const score =
    metrics.instantReplayRate * 0.3 +
    metrics.scrollStopRate * 0.2 +
    metrics.shareVelocity * 0.3 +
    metrics.firstSixSecondRetention * 0.2;

  const rounded = Number(score.toFixed(2));

  return {
    score: rounded,
    tier:
      rounded >= 80
        ? "nuclear"
        : rounded >= 60
          ? "surging"
          : rounded >= 40
            ? "charged"
            : "stable"
  };
}
