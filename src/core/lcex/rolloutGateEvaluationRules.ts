export type RolloutGateEvaluationRulesInput = {
  currentStatus: "draft" | "shadow" | "limited" | "live" | "paused";
  qualityScore: number;
  safetyScore: number;
  trustScore: number;
  opsReady: boolean;
  blockerActive: boolean;
};

export type RolloutGateEvaluationRulesDecision = {
  nextStatus: "draft" | "shadow" | "limited" | "live" | "paused";
  promotable: boolean;
  reason:
    | "ok"
    | "blocker_active"
    | "ops_not_ready"
    | "low_quality"
    | "low_safety"
    | "low_trust"
    | "already_live";
};

export function resolveRolloutGateEvaluation(
  input: RolloutGateEvaluationRulesInput
): RolloutGateEvaluationRulesDecision {
  if (input.blockerActive) {
    return {
      nextStatus: "paused",
      promotable: false,
      reason: "blocker_active",
    };
  }

  if (!input.opsReady) {
    return {
      nextStatus: input.currentStatus,
      promotable: false,
      reason: "ops_not_ready",
    };
  }

  if (input.qualityScore < 70) {
    return {
      nextStatus: input.currentStatus,
      promotable: false,
      reason: "low_quality",
    };
  }

  if (input.safetyScore < 75) {
    return {
      nextStatus: input.currentStatus,
      promotable: false,
      reason: "low_safety",
    };
  }

  if (input.trustScore < 70) {
    return {
      nextStatus: input.currentStatus,
      promotable: false,
      reason: "low_trust",
    };
  }

  if (input.currentStatus === "live") {
    return {
      nextStatus: "live",
      promotable: false,
      reason: "already_live",
    };
  }

  const nextStatus =
    input.currentStatus === "draft"
      ? "shadow"
      : input.currentStatus === "shadow"
      ? "limited"
      : "live";

  return {
    nextStatus,
    promotable: true,
    reason: "ok",
  };
}

export function canPromoteRolloutGate(
  input: RolloutGateEvaluationRulesInput
): boolean {
  return resolveRolloutGateEvaluation(input).promotable;
}
