export type CanonicalCloseoutBlockerRulesInput = {
  missingContracts: number;
  missingGuards: number;
  missingTelemetry: number;
  missingLocks: number;
  unresolvedCriticalIssues: number;
  launchBlocked: boolean;
};

export type CanonicalCloseoutBlockerRulesDecision = {
  blocked: boolean;
  reasons: Array<
    | "missing_contracts"
    | "missing_guards"
    | "missing_telemetry"
    | "missing_locks"
    | "critical_issues_unresolved"
    | "launch_blocked"
  >;
};

export function resolveCanonicalCloseoutBlockers(
  input: CanonicalCloseoutBlockerRulesInput
): CanonicalCloseoutBlockerRulesDecision {
  const reasons: CanonicalCloseoutBlockerRulesDecision["reasons"] = [];

  if (input.missingContracts > 0) reasons.push("missing_contracts");
  if (input.missingGuards > 0) reasons.push("missing_guards");
  if (input.missingTelemetry > 0) reasons.push("missing_telemetry");
  if (input.missingLocks > 0) reasons.push("missing_locks");
  if (input.unresolvedCriticalIssues > 0) reasons.push("critical_issues_unresolved");
  if (input.launchBlocked) reasons.push("launch_blocked");

  return {
    blocked: reasons.length > 0,
    reasons,
  };
}

export function hasCanonicalCloseoutBlockers(
  input: CanonicalCloseoutBlockerRulesInput
): boolean {
  return resolveCanonicalCloseoutBlockers(input).blocked;
}
