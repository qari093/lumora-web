export type SealRevocationRulesInput = {
  currentStatus: "pending" | "sealed" | "revoked";
  criticalSafetyIncident: boolean;
  criticalTrustIncident: boolean;
  launchBlocked: boolean;
  opsRevocationRequested: boolean;
};

export type SealRevocationRulesDecision = {
  revocable: boolean;
  nextStatus: "pending" | "sealed" | "revoked";
  reason:
    | "ok"
    | "not_sealed"
    | "critical_safety_incident"
    | "critical_trust_incident"
    | "launch_blocked"
    | "ops_requested"
    | "no_revocation_trigger";
};

export function resolveSealRevocation(
  input: SealRevocationRulesInput
): SealRevocationRulesDecision {
  if (input.currentStatus !== "sealed") {
    return {
      revocable: false,
      nextStatus: input.currentStatus,
      reason: "not_sealed",
    };
  }

  if (input.criticalSafetyIncident) {
    return {
      revocable: true,
      nextStatus: "revoked",
      reason: "critical_safety_incident",
    };
  }

  if (input.criticalTrustIncident) {
    return {
      revocable: true,
      nextStatus: "revoked",
      reason: "critical_trust_incident",
    };
  }

  if (input.launchBlocked) {
    return {
      revocable: true,
      nextStatus: "revoked",
      reason: "launch_blocked",
    };
  }

  if (input.opsRevocationRequested) {
    return {
      revocable: true,
      nextStatus: "revoked",
      reason: "ops_requested",
    };
  }

  return {
    revocable: false,
    nextStatus: "sealed",
    reason: "no_revocation_trigger",
  };
}

export function shouldRevokeSeal(
  input: SealRevocationRulesInput
): boolean {
  return resolveSealRevocation(input).revocable;
}
