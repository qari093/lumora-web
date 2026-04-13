export type TerminalSealActivationRulesInput = {
  currentStatus: "pending" | "armed" | "sealed" | "revoked";
  blockersActive: boolean;
  opsApproved: boolean;
  verificationPassed: boolean;
  launchCorridorReady: boolean;
};

export type TerminalSealActivationRulesDecision = {
  activatable: boolean;
  nextStatus: "pending" | "armed" | "sealed" | "revoked";
  reason:
    | "ok"
    | "not_armed"
    | "blockers_active"
    | "ops_not_approved"
    | "verification_not_passed"
    | "launch_corridor_not_ready";
};

export function resolveTerminalSealActivation(
  input: TerminalSealActivationRulesInput
): TerminalSealActivationRulesDecision {
  if (input.currentStatus !== "armed") {
    return {
      activatable: false,
      nextStatus: input.currentStatus,
      reason: "not_armed",
    };
  }

  if (input.blockersActive) {
    return {
      activatable: false,
      nextStatus: "armed",
      reason: "blockers_active",
    };
  }

  if (!input.opsApproved) {
    return {
      activatable: false,
      nextStatus: "armed",
      reason: "ops_not_approved",
    };
  }

  if (!input.verificationPassed) {
    return {
      activatable: false,
      nextStatus: "armed",
      reason: "verification_not_passed",
    };
  }

  if (!input.launchCorridorReady) {
    return {
      activatable: false,
      nextStatus: "armed",
      reason: "launch_corridor_not_ready",
    };
  }

  return {
    activatable: true,
    nextStatus: "sealed",
    reason: "ok",
  };
}

export function canActivateTerminalSeal(
  input: TerminalSealActivationRulesInput
): boolean {
  return resolveTerminalSealActivation(input).activatable;
}
