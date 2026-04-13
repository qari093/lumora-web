export type RolloutGateResumeRulesInput = {
  currentStatus: "draft" | "shadow" | "limited" | "live" | "paused";
  previousStatus?: "draft" | "shadow" | "limited" | "live";
  blockerCleared: boolean;
  safetyIncidentCleared: boolean;
  trustIncidentCleared: boolean;
  opsApproved: boolean;
};

export type RolloutGateResumeRulesDecision = {
  resumable: boolean;
  nextStatus: "draft" | "shadow" | "limited" | "live" | "paused";
  reason:
    | "ok"
    | "not_paused"
    | "blocker_not_cleared"
    | "safety_not_cleared"
    | "trust_not_cleared"
    | "ops_not_approved";
};

export function resolveRolloutGateResume(
  input: RolloutGateResumeRulesInput
): RolloutGateResumeRulesDecision {
  if (input.currentStatus !== "paused") {
    return {
      resumable: false,
      nextStatus: input.currentStatus,
      reason: "not_paused",
    };
  }

  if (!input.blockerCleared) {
    return {
      resumable: false,
      nextStatus: "paused",
      reason: "blocker_not_cleared",
    };
  }

  if (!input.safetyIncidentCleared) {
    return {
      resumable: false,
      nextStatus: "paused",
      reason: "safety_not_cleared",
    };
  }

  if (!input.trustIncidentCleared) {
    return {
      resumable: false,
      nextStatus: "paused",
      reason: "trust_not_cleared",
    };
  }

  if (!input.opsApproved) {
    return {
      resumable: false,
      nextStatus: "paused",
      reason: "ops_not_approved",
    };
  }

  return {
    resumable: true,
    nextStatus: input.previousStatus ?? "shadow",
    reason: "ok",
  };
}

export function canResumeRolloutGate(
  input: RolloutGateResumeRulesInput
): boolean {
  return resolveRolloutGateResume(input).resumable;
}
