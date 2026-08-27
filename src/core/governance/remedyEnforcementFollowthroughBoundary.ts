export const REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION =
  "mega45-v1" as const;

export type RemedyFollowthroughState =
  | "pending"
  | "in_progress"
  | "applied"
  | "completed"
  | "failed"
  | "partially_applied"
  | "blocked";

export type RemedyFollowthroughReason =
  | "original_decision_reference_required"
  | "appeal_or_remedy_reference_required"
  | "granted_relief_required"
  | "authorized_remedy_owner_required"
  | "human_review_required"
  | "remedy_state_required"
  | "remedy_scope_required"
  | "corrective_action_required"
  | "audit_reference_required"
  | "idempotency_key_required"
  | "duplicate_effectuation_blocked"
  | "remedy_scope_exceeded"
  | "silent_non_enforcement_blocked"
  | "failed_effectuation_visibility_required"
  | "partial_effectuation_visibility_required"
  | "escalation_required"
  | "restoration_state_required"
  | "affected_subject_reference_required"
  | "privacy_boundary_required"
  | "security_sensitive_evidence_exposure_blocked"
  | "secret_rights_restriction_blocked"
  | "wealth_authority_blocked"
  | "popularity_authority_blocked"
  | "follower_authority_blocked"
  | "token_authority_blocked"
  | "governmental_authority_creation_blocked"
  | "legal_citizenship_claim_blocked"
  | "statehood_claim_blocked"
  | "independent_jurisdiction_claim_blocked"
  | "unsafe_effectuation_blocked"
  | "authorized";

export interface RemedyEnforcementFollowthroughInput {
  originalDecisionReference: string;
  appealOrRemedyReference: string;
  grantedRelief: string;
  authorizedRemedyOwner: string;
  humanReviewCompleted: boolean;

  remedyState: RemedyFollowthroughState;
  remedyScope: string;
  correctiveAction: string;
  auditReference: string;
  idempotencyKey: string;

  duplicateEffectuationAttempt?: boolean;
  exceedsGrantedRelief?: boolean;
  grantedReliefLeftUnenforced?: boolean;

  failedEffectuationVisible?: boolean;
  partialEffectuationVisible?: boolean;
  escalationReference?: string | null;

  restorationRequired?: boolean;
  restorationState?: string | null;

  affectedSubjectReference: string;

  privacyBoundaryConfirmed: boolean;
  exposesSecuritySensitiveEvidence?: boolean;
  createsSecretRightsRestriction?: boolean;

  wealthSetsAuthority?: boolean;
  popularitySetsAuthority?: boolean;
  followerCountSetsAuthority?: boolean;
  tokenBalanceSetsAuthority?: boolean;

  createsGovernmentalAuthority?: boolean;
  claimsLegalCitizenship?: boolean;
  claimsStatehood?: boolean;
  claimsIndependentJurisdiction?: boolean;

  effectuationSafe: boolean;
}

export interface RemedyEnforcementFollowthroughDecision {
  allowed: boolean;
  reason: RemedyFollowthroughReason;
  version: typeof REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION;

  effectiveReliefRequired: true;
  paperOnlyRemedyAllowed: false;
  humanReviewRequiredForConsequentialRemedy: true;

  deterministicRemedyStateRequired: true;
  idempotentEffectuationRequired: true;
  duplicateEffectuationAllowed: false;
  remedyMayExceedGrantedRelief: false;

  failedEffectuationMustRemainVisible: true;
  partialEffectuationMustRemainVisible: true;
  escalationRequiredWhenRepairCannotComplete: true;

  privacySafeAccountabilityRequired: true;
  securitySensitiveEvidencePubliclyExposable: false;
  secretRightsRestrictionAllowed: false;

  wealthMayCreateRemedyAuthority: false;
  popularityMayCreateRemedyAuthority: false;
  followerCountMayCreateRemedyAuthority: false;
  tokenBalanceMayCreateRemedyAuthority: false;

  governmentalAuthorityCreated: false;
  legalCitizenshipCreated: false;
  statehoodCreated: false;
  independentJurisdictionCreated: false;

  unsafeEffectuationFailsClosed: true;
  scope: "launch_remedy_enforcement_followthrough_baseline";
}

const present = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validState = (
  value: unknown,
): value is RemedyFollowthroughState =>
  typeof value === "string" &&
  [
    "pending",
    "in_progress",
    "applied",
    "completed",
    "failed",
    "partially_applied",
    "blocked",
  ].includes(value);

function decision(
  reason: RemedyFollowthroughReason,
): RemedyEnforcementFollowthroughDecision {
  return {
    allowed: reason === "authorized",
    reason,
    version: REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION,

    effectiveReliefRequired: true,
    paperOnlyRemedyAllowed: false,
    humanReviewRequiredForConsequentialRemedy: true,

    deterministicRemedyStateRequired: true,
    idempotentEffectuationRequired: true,
    duplicateEffectuationAllowed: false,
    remedyMayExceedGrantedRelief: false,

    failedEffectuationMustRemainVisible: true,
    partialEffectuationMustRemainVisible: true,
    escalationRequiredWhenRepairCannotComplete: true,

    privacySafeAccountabilityRequired: true,
    securitySensitiveEvidencePubliclyExposable: false,
    secretRightsRestrictionAllowed: false,

    wealthMayCreateRemedyAuthority: false,
    popularityMayCreateRemedyAuthority: false,
    followerCountMayCreateRemedyAuthority: false,
    tokenBalanceMayCreateRemedyAuthority: false,

    governmentalAuthorityCreated: false,
    legalCitizenshipCreated: false,
    statehoodCreated: false,
    independentJurisdictionCreated: false,

    unsafeEffectuationFailsClosed: true,
    scope: "launch_remedy_enforcement_followthrough_baseline",
  };
}

export function evaluateRemedyEnforcementFollowthrough(
  input: RemedyEnforcementFollowthroughInput,
): RemedyEnforcementFollowthroughDecision {
  if (!present(input.originalDecisionReference)) {
    return decision("original_decision_reference_required");
  }

  if (!present(input.appealOrRemedyReference)) {
    return decision("appeal_or_remedy_reference_required");
  }

  if (!present(input.grantedRelief)) {
    return decision("granted_relief_required");
  }

  if (!present(input.authorizedRemedyOwner)) {
    return decision("authorized_remedy_owner_required");
  }

  if (input.humanReviewCompleted !== true) {
    return decision("human_review_required");
  }

  if (!validState(input.remedyState)) {
    return decision("remedy_state_required");
  }

  if (!present(input.remedyScope)) {
    return decision("remedy_scope_required");
  }

  if (!present(input.correctiveAction)) {
    return decision("corrective_action_required");
  }

  if (!present(input.auditReference)) {
    return decision("audit_reference_required");
  }

  if (!present(input.idempotencyKey)) {
    return decision("idempotency_key_required");
  }

  if (input.duplicateEffectuationAttempt === true) {
    return decision("duplicate_effectuation_blocked");
  }

  if (input.exceedsGrantedRelief === true) {
    return decision("remedy_scope_exceeded");
  }

  if (input.grantedReliefLeftUnenforced === true) {
    return decision("silent_non_enforcement_blocked");
  }

  if (
    input.remedyState === "failed" &&
    input.failedEffectuationVisible !== true
  ) {
    return decision("failed_effectuation_visibility_required");
  }

  if (
    input.remedyState === "partially_applied" &&
    input.partialEffectuationVisible !== true
  ) {
    return decision("partial_effectuation_visibility_required");
  }

  if (
    ["failed", "partially_applied", "blocked"].includes(
      input.remedyState,
    ) &&
    !present(input.escalationReference ?? "")
  ) {
    return decision("escalation_required");
  }

  if (
    input.restorationRequired === true &&
    !present(input.restorationState ?? "")
  ) {
    return decision("restoration_state_required");
  }

  if (!present(input.affectedSubjectReference)) {
    return decision("affected_subject_reference_required");
  }

  if (input.privacyBoundaryConfirmed !== true) {
    return decision("privacy_boundary_required");
  }

  if (input.exposesSecuritySensitiveEvidence === true) {
    return decision("security_sensitive_evidence_exposure_blocked");
  }

  if (input.createsSecretRightsRestriction === true) {
    return decision("secret_rights_restriction_blocked");
  }

  if (input.wealthSetsAuthority === true) {
    return decision("wealth_authority_blocked");
  }

  if (input.popularitySetsAuthority === true) {
    return decision("popularity_authority_blocked");
  }

  if (input.followerCountSetsAuthority === true) {
    return decision("follower_authority_blocked");
  }

  if (input.tokenBalanceSetsAuthority === true) {
    return decision("token_authority_blocked");
  }

  if (input.createsGovernmentalAuthority === true) {
    return decision("governmental_authority_creation_blocked");
  }

  if (input.claimsLegalCitizenship === true) {
    return decision("legal_citizenship_claim_blocked");
  }

  if (input.claimsStatehood === true) {
    return decision("statehood_claim_blocked");
  }

  if (input.claimsIndependentJurisdiction === true) {
    return decision("independent_jurisdiction_claim_blocked");
  }

  if (input.effectuationSafe !== true) {
    return decision("unsafe_effectuation_blocked");
  }

  return decision("authorized");
}

export const REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT =
  Object.freeze({
    version: REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION,

    successfulRemedyRequiresEffectiveFollowthrough: true,
    paperOnlyRemedyAllowed: false,
    humanReviewRequiredForConsequentialRemedy: true,

    remedyStateMustBeExplicit: true,
    permittedStates: Object.freeze([
      "pending",
      "in_progress",
      "applied",
      "completed",
      "failed",
      "partially_applied",
      "blocked",
    ] as const),

    remedyCannotExceedGrantedRelief: true,
    idempotencyRequired: true,
    duplicateEffectuationAllowed: false,

    failedAndPartialEffectuationRemainVisible: true,
    escalationRequiredWhenRepairCannotComplete: true,

    privacySafeAccountabilityRequired: true,
    securitySensitiveEvidencePubliclyExposable: false,
    secretRightsRestrictionAllowed: false,

    wealthPopularityFollowersAndTokensDoNotCreateRemedyAuthority:
      true,

    governmentalAuthorityCreated: false,
    legalCitizenshipCreated: false,
    statehoodCreated: false,
    independentJurisdictionCreated: false,

    unsafeEffectuationFailsClosed: true,
  });
