export type RolloutGatePauseRulesInput = {
  currentStatus: "draft" | "shadow" | "limited" | "live" | "paused";
  blockerActive: boolean;
  safetyIncidentActive: boolean;
  trustIncidentActive: boolean;
  opsInterventionRequested: boolean;
};

export type RolloutGatePauseRulesDecision = {
  pausable: boolean;
  nextStatus: "draft" | "shadow" | "limited" | "live" | "paused";
  reason:
    | "ok"
    | "already_paused"
    | "blocker_active"
    | "safety_incident"
    | "trust_incident"
    | "ops_intervention"
    | "no_pause_trigger";
};

export function resolveRolloutGatePause(
  input: RolloutGatePauseRulesInput
): RolloutGatePauseRulesDecision {
  if (input.currentStatus === "paused") {
    return {
      pausable: false,
      nextStatus: "paused",
      reason: "already_paused",
    };
  }

  if (input.safetyIncidentActive) {
    return {
      pausable: true,
      nextStatus: "paused",
      reason: "safety_incident",
    };
  }

  if (input.trustIncidentActive) {
    return {
      pausable: true,
      nextStatus: "paused",
      reason: "trust_incident",
    };
  }

  if (input.blockerActive) {
    return {
      pausable: true,
      nextStatus: "paused",
      reason: "blocker_active",
    };
  }

  if (input.opsInterventionRequested) {
    return {
      pausable: true,
      nextStatus: "paused",
      reason: "ops_intervention",
    };
  }

  return {
    pausable: false,
    nextStatus: input.currentStatus,
    reason: "no_pause_trigger",
  };
}

export function shouldPauseRolloutGate(
  input: RolloutGatePauseRulesInput
): boolean {
  return resolveRolloutGatePause(input).pausable;
}
