export const JURISDICTIONAL_COMPLIANCE_OVERLAY_BOUNDARY_VERSION = "mega43-v1" as const;
export type JurisdictionalOverlayReason =
  | "authorized" | "jurisdiction_required" | "applicable_law_basis_required"
  | "overlay_purpose_required" | "lawful_requirement_required"
  | "rights_impact_review_required" | "fundamental_rights_reduction_blocked"
  | "due_process_removal_blocked" | "privacy_baseline_removal_blocked"
  | "accountability_removal_blocked" | "human_review_removal_blocked"
  | "remedy_or_appeal_removal_blocked" | "secret_rights_restriction_blocked"
  | "constitutional_core_override_blocked" | "governmental_authority_creation_blocked"
  | "legal_citizenship_claim_blocked" | "statehood_claim_blocked"
  | "independent_jurisdiction_claim_blocked" | "corporate_legal_entity_override_blocked"
  | "unbounded_overlay_blocked" | "public_accountability_reference_required";

export interface JurisdictionalComplianceOverlayInput {
  jurisdiction: string;
  applicableLawBasis: string;
  overlayPurpose: string;
  lawfulRequirementIdentified: boolean;
  scopeBoundedToJurisdiction: boolean;
  rightsImpactReviewCompleted: boolean;
  increasesProtection?: boolean;
  imposesLawfulRestriction?: boolean;
  reducesFundamentalRights?: boolean;
  removesDueProcess?: boolean;
  removesPrivacyBaseline?: boolean;
  removesAccountability?: boolean;
  removesHumanReview?: boolean;
  removesRemedyOrAppeal?: boolean;
  createsSecretRightsRestriction?: boolean;
  overridesConstitutionalCore?: boolean;
  createsGovernmentalAuthority?: boolean;
  claimsLegalCitizenship?: boolean;
  claimsStatehood?: boolean;
  claimsIndependentJurisdiction?: boolean;
  overridesCorporateLegalEntity?: boolean;
  publicAccountabilityReference?: string | null;
}

export interface JurisdictionalComplianceOverlayDecision {
  allowed: boolean;
  reason: JurisdictionalOverlayReason;
  boundaryVersion: typeof JURISDICTIONAL_COMPLIANCE_OVERLAY_BOUNDARY_VERSION;
  fundamentalRightsFloorPreserved: true;
  dueProcessBaselinePreserved: true;
  privacyBaselinePreserved: true;
  accountabilityBaselinePreserved: true;
  humanReviewBaselinePreserved: true;
  remedyAndAppealBaselinePreserved: true;
  constitutionalCoreCannotBeSilentlyOverridden: true;
  platformDoesNotBecomeGovernment: true;
  communityMembershipDoesNotCreateLegalCitizenship: true;
  overlayDoesNotCreateStatehood: true;
  overlayDoesNotCreateIndependentJurisdiction: true;
  platformRemainsSubjectToApplicableLaw: true;
  corporateLegalEntityBoundaryPreserved: true;
  scope: "launch_jurisdictional_compliance_overlay_baseline";
}

const present = (v: string | null | undefined) => typeof v === "string" && v.trim().length > 0;
const decision = (reason: JurisdictionalOverlayReason): JurisdictionalComplianceOverlayDecision => Object.freeze({
  allowed: reason === "authorized",
  reason,
  boundaryVersion: JURISDICTIONAL_COMPLIANCE_OVERLAY_BOUNDARY_VERSION,
  fundamentalRightsFloorPreserved: true,
  dueProcessBaselinePreserved: true,
  privacyBaselinePreserved: true,
  accountabilityBaselinePreserved: true,
  humanReviewBaselinePreserved: true,
  remedyAndAppealBaselinePreserved: true,
  constitutionalCoreCannotBeSilentlyOverridden: true,
  platformDoesNotBecomeGovernment: true,
  communityMembershipDoesNotCreateLegalCitizenship: true,
  overlayDoesNotCreateStatehood: true,
  overlayDoesNotCreateIndependentJurisdiction: true,
  platformRemainsSubjectToApplicableLaw: true,
  corporateLegalEntityBoundaryPreserved: true,
  scope: "launch_jurisdictional_compliance_overlay_baseline",
});

export function evaluateJurisdictionalComplianceOverlay(input: JurisdictionalComplianceOverlayInput): JurisdictionalComplianceOverlayDecision {
  if (!present(input.jurisdiction)) return decision("jurisdiction_required");
  if (!present(input.applicableLawBasis)) return decision("applicable_law_basis_required");
  if (!present(input.overlayPurpose)) return decision("overlay_purpose_required");
  if (input.lawfulRequirementIdentified !== true) return decision("lawful_requirement_required");
  if (input.scopeBoundedToJurisdiction !== true) return decision("unbounded_overlay_blocked");
  if (input.rightsImpactReviewCompleted !== true) return decision("rights_impact_review_required");
  if (input.reducesFundamentalRights) return decision("fundamental_rights_reduction_blocked");
  if (input.removesDueProcess) return decision("due_process_removal_blocked");
  if (input.removesPrivacyBaseline) return decision("privacy_baseline_removal_blocked");
  if (input.removesAccountability) return decision("accountability_removal_blocked");
  if (input.removesHumanReview) return decision("human_review_removal_blocked");
  if (input.removesRemedyOrAppeal) return decision("remedy_or_appeal_removal_blocked");
  if (input.createsSecretRightsRestriction) return decision("secret_rights_restriction_blocked");
  if (input.overridesConstitutionalCore) return decision("constitutional_core_override_blocked");
  if (input.createsGovernmentalAuthority) return decision("governmental_authority_creation_blocked");
  if (input.claimsLegalCitizenship) return decision("legal_citizenship_claim_blocked");
  if (input.claimsStatehood) return decision("statehood_claim_blocked");
  if (input.claimsIndependentJurisdiction) return decision("independent_jurisdiction_claim_blocked");
  if (input.overridesCorporateLegalEntity) return decision("corporate_legal_entity_override_blocked");
  if (!present(input.publicAccountabilityReference)) return decision("public_accountability_reference_required");
  return decision("authorized");
}

export const JURISDICTIONAL_COMPLIANCE_OVERLAY_CONTRACT = Object.freeze({
  boundaryVersion: JURISDICTIONAL_COMPLIANCE_OVERLAY_BOUNDARY_VERSION,
  constitutionalCoreIsMinimumProtectionFloor: true,
  jurisdictionalRulesMayIncreaseProtection: true,
  jurisdictionalRulesMayApplyLawfulRestrictions: true,
  jurisdictionalRulesCannotSilentlyEraseFundamentalRights: true,
  rightsImpactReviewRequired: true,
  publicAccountabilityRequired: true,
  scopeMustBeBoundedToApplicableJurisdiction: true,
  platformRemainsSubjectToApplicableLaw: true,
  platformRemainsCommercialLegalEntity: true,
  governmentalStatusCreated: false,
  legalCitizenshipCreated: false,
  statehoodCreated: false,
  independentJurisdictionCreated: false,
});
