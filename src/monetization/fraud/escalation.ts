export function resolveFraudEscalation(input: {
  anomalyScore: number;
  persistentFlags: number;
}) {
  if (input.anomalyScore >= 0.85 || input.persistentFlags >= 3) {
    return { level: "hard_check" as const, reason: "high_risk_pattern" };
  }

  if (input.anomalyScore >= 0.55 || input.persistentFlags >= 1) {
    return { level: "soft_check" as const, reason: "medium_risk_pattern" };
  }

  return { level: "none" as const, reason: "normal_behavior" };
}
