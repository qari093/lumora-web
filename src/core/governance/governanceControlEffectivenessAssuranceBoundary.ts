export const GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION = "mega46-v1" as const;

export type EffectivenessState =
  | "effective"
  | "degraded"
  | "failed"
  | "unverified";

export type AssuranceReason =
  | "authorized"
  | "control_identifier_required"
  | "control_version_required"
  | "implementation_evidence_required"
  | "validation_evidence_required"
  | "effectiveness_state_required"
  | "effective_state_without_success_evidence_blocked"
  | "failed_control_cannot_be_certified_effective"
  | "unverified_control_cannot_be_certified_effective"
  | "material_failure_escalation_required"
  | "reviewer_identity_required"
  | "review_separation_required"
  | "self_certification_blocked"
  | "human_review_required"
  | "audit_reference_required"
  | "privacy_exposure_blocked"
  | "economic_or_popularity_authority_blocked"
  | "governmental_authority_claim_blocked"
  | "legal_citizenship_claim_blocked"
  | "statehood_claim_blocked"
  | "independent_jurisdiction_claim_blocked";

export interface AssuranceInput {
  controlIdentifier: string;
  declaredControlVersion: string;
  implementationEvidence: string[];
  validationEvidence: string[];
  effectivenessState: EffectivenessState | null;
  implementationVerified: boolean;
  validationPassed: boolean;
  materialFailurePresent: boolean;
  escalationReference?: string | null;
  reviewerUserId: string;
  implementationOwnerUserId: string;
  reviewerIndependentFromImplementationOwner: boolean;
  reviewerHasBoundedAuthority: boolean;
  selfCertificationRequested?: boolean;
  consequentialFinding: boolean;
  humanReviewCompleted: boolean;
  auditReference: string;
  containsPublicSensitiveEvidence?: boolean;
  authorityDerivedFromWealth?: boolean;
  authorityDerivedFromPopularity?: boolean;
  authorityDerivedFromFollowers?: boolean;
  authorityDerivedFromTokens?: boolean;
  claimsGovernmentalAuthority?: boolean;
  claimsLegalCitizenship?: boolean;
  claimsStatehood?: boolean;
  claimsIndependentJurisdiction?: boolean;
}

function textPresent(v: string | null | undefined) {
  return typeof v === "string" && v.trim().length > 0;
}

function evidencePresent(v: string[] | null | undefined) {
  return Array.isArray(v) && v.some(textPresent);
}

export function evaluateGovernanceControlEffectivenessAssurance(input: AssuranceInput) {
  const deny = (reason: AssuranceReason) => ({
    authorized: false,
    reason,
    boundaryVersion: GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION,
    effectivenessState: input.effectivenessState ?? "not_established",
    canCertifyEffective: false,
  });

  if (!textPresent(input.controlIdentifier)) return deny("control_identifier_required");
  if (!textPresent(input.declaredControlVersion)) return deny("control_version_required");
  if (!evidencePresent(input.implementationEvidence)) return deny("implementation_evidence_required");
  if (!evidencePresent(input.validationEvidence)) return deny("validation_evidence_required");

  if (
    input.effectivenessState !== "effective" &&
    input.effectivenessState !== "degraded" &&
    input.effectivenessState !== "failed" &&
    input.effectivenessState !== "unverified"
  ) return deny("effectiveness_state_required");

  if (
    input.effectivenessState === "effective" &&
    (!input.implementationVerified || !input.validationPassed)
  ) return deny("effective_state_without_success_evidence_blocked");

  if (input.effectivenessState === "failed")
    return deny("failed_control_cannot_be_certified_effective");

  if (input.effectivenessState === "unverified")
    return deny("unverified_control_cannot_be_certified_effective");

  if (input.materialFailurePresent && !textPresent(input.escalationReference))
    return deny("material_failure_escalation_required");

  if (!textPresent(input.reviewerUserId)) return deny("reviewer_identity_required");

  if (
    !textPresent(input.implementationOwnerUserId) ||
    input.reviewerUserId === input.implementationOwnerUserId ||
    !input.reviewerIndependentFromImplementationOwner ||
    !input.reviewerHasBoundedAuthority
  ) return deny("review_separation_required");

  if (input.selfCertificationRequested === true)
    return deny("self_certification_blocked");

  if (input.consequentialFinding && !input.humanReviewCompleted)
    return deny("human_review_required");

  if (!textPresent(input.auditReference)) return deny("audit_reference_required");

  if (input.containsPublicSensitiveEvidence === true)
    return deny("privacy_exposure_blocked");

  if (
    input.authorityDerivedFromWealth ||
    input.authorityDerivedFromPopularity ||
    input.authorityDerivedFromFollowers ||
    input.authorityDerivedFromTokens
  ) return deny("economic_or_popularity_authority_blocked");

  if (input.claimsGovernmentalAuthority)
    return deny("governmental_authority_claim_blocked");
  if (input.claimsLegalCitizenship)
    return deny("legal_citizenship_claim_blocked");
  if (input.claimsStatehood)
    return deny("statehood_claim_blocked");
  if (input.claimsIndependentJurisdiction)
    return deny("independent_jurisdiction_claim_blocked");

  return {
    authorized: true,
    reason: "authorized" as const,
    boundaryVersion: GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION,
    effectivenessState: input.effectivenessState,
    canCertifyEffective: input.effectivenessState === "effective",
  };
}

export const GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_CONTRACT = {
  version: GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION,
  paperComplianceIsInsufficient: true,
  failedControlCannotBeCertifiedEffective: true,
  unverifiedControlCannotBeCertifiedEffective: true,
  separatedReviewRequired: true,
  unboundedSelfCertificationAllowed: false,
  humanReviewRequiredForConsequentialFindings: true,
  sensitiveEvidenceMustRemainPrivate: true,
  wealthCreatesOversightAuthority: false,
  popularityCreatesOversightAuthority: false,
  followersCreateOversightAuthority: false,
  tokensCreateOversightAuthority: false,
  governmentalAuthorityCreated: false,
  legalCitizenshipCreated: false,
  statehoodCreated: false,
  independentJurisdictionCreated: false,
  platformRemainsSubjectToApplicableLaw: true,
} as const;
