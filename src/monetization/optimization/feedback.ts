export function evaluateOptimizationFeedback(input: {
  retentionDelta: number;
  revenueDelta: number;
  skipRateDelta: number;
}) {
  if (input.retentionDelta < -0.05 || input.skipRateDelta > 0.08) {
    return { decision: "rollback" as const, reason: "user_experience_degraded" };
  }

  if (input.revenueDelta > 0.05 && input.retentionDelta >= 0) {
    return { decision: "promote" as const, reason: "revenue_and_retention_improved" };
  }

  return { decision: "hold" as const, reason: "insufficient_signal" };
}
