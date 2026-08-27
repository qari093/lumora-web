export type EmergencyAuthorityInput = {
  authenticated: boolean;
  explicitlyDelegated: boolean;
  emergencyDeclared: boolean;
  documentedReason: boolean;
  necessityEstablished: boolean;
  ordinaryProcessInsufficient: boolean;
  narrowScope: boolean;
  proportionate: boolean;
  temporary: boolean;
  expiresAt?: Date | string | null;
  reviewPathAvailable: boolean;
  remedyAvailable: boolean;
  auditRequired: boolean;
  attemptsToSuspendFundamentalRights?: boolean;
  attemptsIrreversibleGovernanceMutation?: boolean;
  attemptsPermanentAuthorityExpansion?: boolean;
};

export type EmergencyAuthorityDecision = {
  allowed: boolean;
  emergencyAuthorityActive: boolean;
  decisionFinality: "denied" | "temporary_reviewable";
  reason:
    | "unauthenticated"
    | "not_explicitly_delegated"
    | "no_declared_emergency"
    | "reason_not_documented"
    | "necessity_not_established"
    | "ordinary_process_available"
    | "scope_not_narrow"
    | "not_proportionate"
    | "not_temporary"
    | "sunset_missing_or_expired"
    | "review_path_missing"
    | "remedy_missing"
    | "audit_missing"
    | "fundamental_rights_cannot_be_suspended"
    | "irreversible_governance_mutation_forbidden"
    | "permanent_authority_expansion_forbidden"
    | "temporary_emergency_authority_authorized";
  sunsetRequired: true;
  humanReviewRequired: true;
  remedyMustRemainAvailable: true;
  fundamentalRightsRemainInForce: true;
  permanentGovernanceAuthorityGranted: false;
  irreversibleGovernanceMutationAllowed: false;
};

function hasFutureSunset(value: Date | string | null | undefined): boolean {
  if (!value) return false;

  const timestamp =
    value instanceof Date ? value.getTime() : new Date(value).getTime();

  return Number.isFinite(timestamp) && timestamp > Date.now();
}

function denied(
  reason: Exclude<
    EmergencyAuthorityDecision["reason"],
    "temporary_emergency_authority_authorized"
  >,
): EmergencyAuthorityDecision {
  return {
    allowed: false,
    emergencyAuthorityActive: false,
    decisionFinality: "denied",
    reason,
    sunsetRequired: true,
    humanReviewRequired: true,
    remedyMustRemainAvailable: true,
    fundamentalRightsRemainInForce: true,
    permanentGovernanceAuthorityGranted: false,
    irreversibleGovernanceMutationAllowed: false,
  };
}

export function evaluateEmergencyAuthority(
  input: EmergencyAuthorityInput,
): EmergencyAuthorityDecision {
  if (!input.authenticated) return denied("unauthenticated");

  if (!input.explicitlyDelegated) {
    return denied("not_explicitly_delegated");
  }

  if (!input.emergencyDeclared) return denied("no_declared_emergency");

  if (!input.documentedReason) return denied("reason_not_documented");

  if (!input.necessityEstablished) {
    return denied("necessity_not_established");
  }

  if (!input.ordinaryProcessInsufficient) {
    return denied("ordinary_process_available");
  }

  if (!input.narrowScope) return denied("scope_not_narrow");

  if (!input.proportionate) return denied("not_proportionate");

  if (!input.temporary) return denied("not_temporary");

  if (!hasFutureSunset(input.expiresAt)) {
    return denied("sunset_missing_or_expired");
  }

  if (!input.reviewPathAvailable) {
    return denied("review_path_missing");
  }

  if (!input.remedyAvailable) return denied("remedy_missing");

  if (!input.auditRequired) return denied("audit_missing");

  if (input.attemptsToSuspendFundamentalRights === true) {
    return denied("fundamental_rights_cannot_be_suspended");
  }

  if (input.attemptsIrreversibleGovernanceMutation === true) {
    return denied("irreversible_governance_mutation_forbidden");
  }

  if (input.attemptsPermanentAuthorityExpansion === true) {
    return denied("permanent_authority_expansion_forbidden");
  }

  return {
    allowed: true,
    emergencyAuthorityActive: true,
    decisionFinality: "temporary_reviewable",
    reason: "temporary_emergency_authority_authorized",
    sunsetRequired: true,
    humanReviewRequired: true,
    remedyMustRemainAvailable: true,
    fundamentalRightsRemainInForce: true,
    permanentGovernanceAuthorityGranted: false,
    irreversibleGovernanceMutationAllowed: false,
  };
}

export function assertEmergencyAuthorityBoundary(): true {
  const validFutureSunset = new Date(Date.now() + 60_000).toISOString();

  const valid = evaluateEmergencyAuthority({
    authenticated: true,
    explicitlyDelegated: true,
    emergencyDeclared: true,
    documentedReason: true,
    necessityEstablished: true,
    ordinaryProcessInsufficient: true,
    narrowScope: true,
    proportionate: true,
    temporary: true,
    expiresAt: validFutureSunset,
    reviewPathAvailable: true,
    remedyAvailable: true,
    auditRequired: true,
  });

  if (
    !valid.allowed ||
    valid.decisionFinality !== "temporary_reviewable" ||
    valid.permanentGovernanceAuthorityGranted ||
    valid.irreversibleGovernanceMutationAllowed ||
    !valid.remedyMustRemainAvailable ||
    !valid.fundamentalRightsRemainInForce
  ) {
    throw new Error("valid emergency authority contract violated");
  }

  const permanentExpansion = evaluateEmergencyAuthority({
    authenticated: true,
    explicitlyDelegated: true,
    emergencyDeclared: true,
    documentedReason: true,
    necessityEstablished: true,
    ordinaryProcessInsufficient: true,
    narrowScope: true,
    proportionate: true,
    temporary: true,
    expiresAt: validFutureSunset,
    reviewPathAvailable: true,
    remedyAvailable: true,
    auditRequired: true,
    attemptsPermanentAuthorityExpansion: true,
  });

  if (
    permanentExpansion.allowed ||
    permanentExpansion.reason !== "permanent_authority_expansion_forbidden"
  ) {
    throw new Error("emergency authority expanded permanent governance power");
  }

  return true;
}

assertEmergencyAuthorityBoundary();
