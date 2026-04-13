export type FinalBlockerRulesInput = {
  criticalSafetyIncident: boolean;
  criticalTrustIncident: boolean;
  rolloutPaused: boolean;
  opsBacklogCriticalCount: number;
  unresolvedCriticalHealthCount: number;
};

export type FinalBlockerRulesDecision = {
  blocked: boolean;
  reasons: Array<
    | "critical_safety_incident"
    | "critical_trust_incident"
    | "rollout_paused"
    | "ops_backlog_critical"
    | "critical_health_unresolved"
  >;
};

export function resolveFinalBlockers(
  input: FinalBlockerRulesInput
): FinalBlockerRulesDecision {
  const reasons: FinalBlockerRulesDecision["reasons"] = [];

  if (input.criticalSafetyIncident) reasons.push("critical_safety_incident");
  if (input.criticalTrustIncident) reasons.push("critical_trust_incident");
  if (input.rolloutPaused) reasons.push("rollout_paused");
  if (input.opsBacklogCriticalCount > 0) reasons.push("ops_backlog_critical");
  if (input.unresolvedCriticalHealthCount > 0) reasons.push("critical_health_unresolved");

  return {
    blocked: reasons.length > 0,
    reasons,
  };
}

export function hasFinalLaunchBlockers(
  input: FinalBlockerRulesInput
): boolean {
  return resolveFinalBlockers(input).blocked;
}
