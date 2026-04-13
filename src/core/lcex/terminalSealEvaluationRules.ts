export type TerminalSealEvaluationRulesInput = {
  currentStatus: "pending" | "armed" | "sealed" | "revoked";
  finalWaveReady: boolean;
  masterSealPrepared: boolean;
  blockersActive: boolean;
  opsApproved: boolean;
  readinessScore: number;
};

export type TerminalSealEvaluationRulesDecision = {
  armable: boolean;
  nextStatus: "pending" | "armed" | "sealed" | "revoked";
  reason:
    | "ok"
    | "already_armed_or_sealed"
    | "final_wave_not_ready"
    | "master_seal_not_prepared"
    | "blockers_active"
    | "ops_not_approved"
    | "low_readiness";
};

export function resolveTerminalSealEvaluation(
  input: TerminalSealEvaluationRulesInput
): TerminalSealEvaluationRulesDecision {
  if (input.currentStatus === "armed" || input.currentStatus === "sealed") {
    return {
      armable: false,
      nextStatus: input.currentStatus,
      reason: "already_armed_or_sealed",
    };
  }

  if (!input.finalWaveReady) {
    return {
      armable: false,
      nextStatus: "pending",
      reason: "final_wave_not_ready",
    };
  }

  if (!input.masterSealPrepared) {
    return {
      armable: false,
      nextStatus: "pending",
      reason: "master_seal_not_prepared",
    };
  }

  if (input.blockersActive) {
    return {
      armable: false,
      nextStatus: "pending",
      reason: "blockers_active",
    };
  }

  if (!input.opsApproved) {
    return {
      armable: false,
      nextStatus: "pending",
      reason: "ops_not_approved",
    };
  }

  if (input.readinessScore < 95) {
    return {
      armable: false,
      nextStatus: "pending",
      reason: "low_readiness",
    };
  }

  return {
    armable: true,
    nextStatus: "armed",
    reason: "ok",
  };
}

export function canArmTerminalSeal(
  input: TerminalSealEvaluationRulesInput
): boolean {
  return resolveTerminalSealEvaluation(input).armable;
}
