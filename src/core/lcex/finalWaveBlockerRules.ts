export type FinalWaveBlockerRulesInput = {
  missingCloseoutItems: number;
  missingSealItems: number;
  missingVerificationItems: number;
  unresolvedCriticalIssues: number;
  launchBlocked: boolean;
};

export type FinalWaveBlockerRulesDecision = {
  blocked: boolean;
  reasons: Array<
    | "missing_closeout_items"
    | "missing_seal_items"
    | "missing_verification_items"
    | "critical_issues_unresolved"
    | "launch_blocked"
  >;
};

export function resolveFinalWaveBlockers(
  input: FinalWaveBlockerRulesInput
): FinalWaveBlockerRulesDecision {
  const reasons: FinalWaveBlockerRulesDecision["reasons"] = [];

  if (input.missingCloseoutItems > 0) reasons.push("missing_closeout_items");
  if (input.missingSealItems > 0) reasons.push("missing_seal_items");
  if (input.missingVerificationItems > 0) reasons.push("missing_verification_items");
  if (input.unresolvedCriticalIssues > 0) reasons.push("critical_issues_unresolved");
  if (input.launchBlocked) reasons.push("launch_blocked");

  return {
    blocked: reasons.length > 0,
    reasons,
  };
}

export function hasFinalWaveBlockers(
  input: FinalWaveBlockerRulesInput
): boolean {
  return resolveFinalWaveBlockers(input).blocked;
}
