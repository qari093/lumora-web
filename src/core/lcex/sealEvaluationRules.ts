export type SealEvaluationRulesInput = {
  readinessScore: number;
  blockersActive: boolean;
  closeoutReady: boolean;
  priorSealStatus: "pending" | "sealed" | "revoked";
  opsApproved: boolean;
};

export type SealEvaluationRulesDecision = {
  sealable: boolean;
  nextStatus: "pending" | "sealed" | "revoked";
  reason:
    | "ok"
    | "already_sealed"
    | "blockers_active"
    | "closeout_not_ready"
    | "ops_not_approved"
    | "low_readiness";
};

export function resolveSealEvaluation(
  input: SealEvaluationRulesInput
): SealEvaluationRulesDecision {
  if (input.priorSealStatus === "sealed") {
    return {
      sealable: false,
      nextStatus: "sealed",
      reason: "already_sealed",
    };
  }

  if (input.blockersActive) {
    return {
      sealable: false,
      nextStatus: "pending",
      reason: "blockers_active",
    };
  }

  if (!input.closeoutReady) {
    return {
      sealable: false,
      nextStatus: "pending",
      reason: "closeout_not_ready",
    };
  }

  if (!input.opsApproved) {
    return {
      sealable: false,
      nextStatus: "pending",
      reason: "ops_not_approved",
    };
  }

  if (input.readinessScore < 92) {
    return {
      sealable: false,
      nextStatus: "pending",
      reason: "low_readiness",
    };
  }

  return {
    sealable: true,
    nextStatus: "sealed",
    reason: "ok",
  };
}

export function canSealCanonicalWave(
  input: SealEvaluationRulesInput
): boolean {
  return resolveSealEvaluation(input).sealable;
}
