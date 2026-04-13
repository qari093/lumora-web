export type SystemHealthRecoveryRulesInput = {
  tier: "healthy" | "watch" | "high-risk" | "critical";
  actionApplied: boolean;
  coolingOffHours: number;
  metricImprovementScore: number;
  safetyLinked: boolean;
};

export type SystemHealthRecoveryRulesDecision = {
  recoverable: boolean;
  nextTier: "healthy" | "watch" | "high-risk" | "critical";
  reason:
    | "ok"
    | "action_missing"
    | "cooling_off_incomplete"
    | "insufficient_improvement"
    | "safety_hold";
};

export function resolveSystemHealthRecovery(
  input: SystemHealthRecoveryRulesInput
): SystemHealthRecoveryRulesDecision {
  if (input.safetyLinked) {
    return {
      recoverable: false,
      nextTier: input.tier,
      reason: "safety_hold",
    };
  }

  if (!input.actionApplied) {
    return {
      recoverable: false,
      nextTier: input.tier,
      reason: "action_missing",
    };
  }

  if (input.coolingOffHours < 6) {
    return {
      recoverable: false,
      nextTier: input.tier,
      reason: "cooling_off_incomplete",
    };
  }

  if (input.metricImprovementScore < 20) {
    return {
      recoverable: false,
      nextTier: input.tier,
      reason: "insufficient_improvement",
    };
  }

  const nextTier =
    input.tier === "critical"
      ? "high-risk"
      : input.tier === "high-risk"
      ? "watch"
      : "healthy";

  return {
    recoverable: true,
    nextTier,
    reason: "ok",
  };
}

export function canRecoverSystemHealth(
  input: SystemHealthRecoveryRulesInput
): boolean {
  return resolveSystemHealthRecovery(input).recoverable;
}
