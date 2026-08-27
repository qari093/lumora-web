export const CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION = "mega44-v1" as const;

export type GovernanceRuleSource =
  | "applicable_law"
  | "constitutional_core"
  | "jurisdictional_overlay"
  | "rights_impact_review"
  | "due_process"
  | "human_review"
  | "remedy_and_appeal"
  | "privacy"
  | "public_accountability"
  | "emergency_authority"
  | "delegated_authority"
  | "corporate_authority"
  | "community_rule"
  | "economic_or_treasury_rule"
  | "automation_rule"
  | "constitutional_amendment"
  | "constitutional_ratification"
  | "other";

export type ConstitutionalConflictReason =
  | "conflict_description_required"
  | "left_rule_source_required"
  | "right_rule_source_required"
  | "applicable_law_context_required"
  | "rule_scope_required"
  | "rights_impact_review_required"
  | "unresolved_applicable_law_conflict_blocked"
  | "fundamental_rights_reduction_blocked"
  | "due_process_reduction_blocked"
  | "privacy_reduction_blocked"
  | "human_review_reduction_blocked"
  | "remedy_or_appeal_reduction_blocked"
  | "accountability_reduction_blocked"
  | "emergency_unbounded_precedence_blocked"
  | "delegated_authority_scope_escalation_blocked"
  | "economic_power_precedence_blocked"
  | "popularity_precedence_blocked"
  | "wealth_precedence_blocked"
  | "follower_count_precedence_blocked"
  | "token_balance_precedence_blocked"
  | "secret_precedence_rule_blocked"
  | "governmental_authority_creation_blocked"
  | "independent_jurisdiction_claim_blocked"
  | "legal_citizenship_claim_blocked"
  | "statehood_claim_blocked"
  | "corporate_legal_entity_override_blocked"
  | "public_accountability_reference_required"
  | "conflict_cannot_be_safely_resolved"
  | "authorized";

export interface ConstitutionalConflictResolutionInput {
  conflictDescription: string;
  leftRuleSource: GovernanceRuleSource;
  rightRuleSource: GovernanceRuleSource;
  applicableLawContext: string;
  ruleScope: string;
  rightsImpactReviewCompleted: boolean;

  unresolvedApplicableLawConflict?: boolean;
  reducesFundamentalRights?: boolean;
  reducesDueProcess?: boolean;
  reducesPrivacyBaseline?: boolean;
  reducesHumanReview?: boolean;
  reducesRemedyOrAppeal?: boolean;
  reducesAccountability?: boolean;

  emergencyClaimsUnboundedPrecedence?: boolean;
  delegatedAuthorityExceedsParentScope?: boolean;
  economicPowerSetsPrecedence?: boolean;
  popularitySetsPrecedence?: boolean;
  wealthSetsPrecedence?: boolean;
  followerCountSetsPrecedence?: boolean;
  tokenBalanceSetsPrecedence?: boolean;
  secretPrecedenceRule?: boolean;

  createsGovernmentalAuthority?: boolean;
  claimsIndependentJurisdiction?: boolean;
  claimsLegalCitizenship?: boolean;
  claimsStatehood?: boolean;
  overridesCorporateLegalEntity?: boolean;

  conflictSafelyResolvable: boolean;
  publicAccountabilityReference?: string | null;
}

export interface ConstitutionalConflictResolutionDecision {
  allowed: boolean;
  reason: ConstitutionalConflictReason;
  version: typeof CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION;

  deterministicPrecedenceRequired: true;
  applicableLawMustBeRespected: true;
  constitutionalRightsFloorPreserved: true;
  dueProcessBaselinePreserved: true;
  privacyBaselinePreserved: true;
  humanReviewBaselinePreserved: true;
  remedyAndAppealBaselinePreserved: true;
  accountabilityBaselinePreserved: true;

  emergencyAuthorityHasUnboundedPrecedence: false;
  delegatedAuthorityMayExceedParentScope: false;
  economicPowerMaySetPrecedence: false;
  popularityMaySetPrecedence: false;
  wealthMaySetPrecedence: false;
  followerCountMaySetPrecedence: false;
  tokenBalanceMaySetPrecedence: false;
  secretPrecedenceRulesAllowed: false;

  governmentalStatusCreated: false;
  independentJurisdictionCreated: false;
  legalCitizenshipCreated: false;
  statehoodCreated: false;
  corporateLegalEntityOverridden: false;

  failClosedWhenUnsafeOrUnresolved: true;
  scope: "launch_constitutional_conflict_resolution_baseline";
}

const present = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validSource = (value: unknown): value is GovernanceRuleSource =>
  typeof value === "string" &&
  [
    "applicable_law",
    "constitutional_core",
    "jurisdictional_overlay",
    "rights_impact_review",
    "due_process",
    "human_review",
    "remedy_and_appeal",
    "privacy",
    "public_accountability",
    "emergency_authority",
    "delegated_authority",
    "corporate_authority",
    "community_rule",
    "economic_or_treasury_rule",
    "automation_rule",
    "constitutional_amendment",
    "constitutional_ratification",
    "other",
  ].includes(value);

function decision(
  reason: ConstitutionalConflictReason,
): ConstitutionalConflictResolutionDecision {
  return {
    allowed: reason === "authorized",
    reason,
    version: CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION,

    deterministicPrecedenceRequired: true,
    applicableLawMustBeRespected: true,
    constitutionalRightsFloorPreserved: true,
    dueProcessBaselinePreserved: true,
    privacyBaselinePreserved: true,
    humanReviewBaselinePreserved: true,
    remedyAndAppealBaselinePreserved: true,
    accountabilityBaselinePreserved: true,

    emergencyAuthorityHasUnboundedPrecedence: false,
    delegatedAuthorityMayExceedParentScope: false,
    economicPowerMaySetPrecedence: false,
    popularityMaySetPrecedence: false,
    wealthMaySetPrecedence: false,
    followerCountMaySetPrecedence: false,
    tokenBalanceMaySetPrecedence: false,
    secretPrecedenceRulesAllowed: false,

    governmentalStatusCreated: false,
    independentJurisdictionCreated: false,
    legalCitizenshipCreated: false,
    statehoodCreated: false,
    corporateLegalEntityOverridden: false,

    failClosedWhenUnsafeOrUnresolved: true,
    scope: "launch_constitutional_conflict_resolution_baseline",
  };
}

export function evaluateConstitutionalConflictResolution(
  input: ConstitutionalConflictResolutionInput,
): ConstitutionalConflictResolutionDecision {
  if (!present(input.conflictDescription)) {
    return decision("conflict_description_required");
  }

  if (!validSource(input.leftRuleSource)) {
    return decision("left_rule_source_required");
  }

  if (!validSource(input.rightRuleSource)) {
    return decision("right_rule_source_required");
  }

  if (!present(input.applicableLawContext)) {
    return decision("applicable_law_context_required");
  }

  if (!present(input.ruleScope)) {
    return decision("rule_scope_required");
  }

  if (input.rightsImpactReviewCompleted !== true) {
    return decision("rights_impact_review_required");
  }

  if (input.unresolvedApplicableLawConflict === true) {
    return decision("unresolved_applicable_law_conflict_blocked");
  }

  if (input.reducesFundamentalRights === true) {
    return decision("fundamental_rights_reduction_blocked");
  }

  if (input.reducesDueProcess === true) {
    return decision("due_process_reduction_blocked");
  }

  if (input.reducesPrivacyBaseline === true) {
    return decision("privacy_reduction_blocked");
  }

  if (input.reducesHumanReview === true) {
    return decision("human_review_reduction_blocked");
  }

  if (input.reducesRemedyOrAppeal === true) {
    return decision("remedy_or_appeal_reduction_blocked");
  }

  if (input.reducesAccountability === true) {
    return decision("accountability_reduction_blocked");
  }

  if (input.emergencyClaimsUnboundedPrecedence === true) {
    return decision("emergency_unbounded_precedence_blocked");
  }

  if (input.delegatedAuthorityExceedsParentScope === true) {
    return decision("delegated_authority_scope_escalation_blocked");
  }

  if (input.economicPowerSetsPrecedence === true) {
    return decision("economic_power_precedence_blocked");
  }

  if (input.popularitySetsPrecedence === true) {
    return decision("popularity_precedence_blocked");
  }

  if (input.wealthSetsPrecedence === true) {
    return decision("wealth_precedence_blocked");
  }

  if (input.followerCountSetsPrecedence === true) {
    return decision("follower_count_precedence_blocked");
  }

  if (input.tokenBalanceSetsPrecedence === true) {
    return decision("token_balance_precedence_blocked");
  }

  if (input.secretPrecedenceRule === true) {
    return decision("secret_precedence_rule_blocked");
  }

  if (input.createsGovernmentalAuthority === true) {
    return decision("governmental_authority_creation_blocked");
  }

  if (input.claimsIndependentJurisdiction === true) {
    return decision("independent_jurisdiction_claim_blocked");
  }

  if (input.claimsLegalCitizenship === true) {
    return decision("legal_citizenship_claim_blocked");
  }

  if (input.claimsStatehood === true) {
    return decision("statehood_claim_blocked");
  }

  if (input.overridesCorporateLegalEntity === true) {
    return decision("corporate_legal_entity_override_blocked");
  }

  if (input.conflictSafelyResolvable !== true) {
    return decision("conflict_cannot_be_safely_resolved");
  }

  if (!present(input.publicAccountabilityReference)) {
    return decision("public_accountability_reference_required");
  }

  return decision("authorized");
}

export const CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT = Object.freeze({
  version: CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION,
  deterministicResolutionRequired: true,
  applicableLawMustBeRespected: true,
  constitutionalCoreIsMinimumProtectionFloor: true,
  fundamentalRightsCannotBeSilentlyReduced: true,
  dueProcessCannotBeSilentlyRemoved: true,
  privacyBaselineCannotBeSilentlyRemoved: true,
  humanReviewCannotBeSilentlyRemoved: true,
  remedyAndAppealCannotBeSilentlyRemoved: true,
  accountabilityCannotBeSilentlyRemoved: true,
  emergencyAuthorityCannotClaimUnboundedPrecedence: true,
  delegatedAuthorityCannotExceedParentScope: true,
  wealthPopularityFollowersAndTokensDoNotCreatePrecedence: true,
  secretPrecedenceRulesAllowed: false,
  unresolvedUnsafeConflictsFailClosed: true,
  platformRemainsSubjectToApplicableLaw: true,
  governmentalStatusCreated: false,
  legalCitizenshipCreated: false,
  statehoodCreated: false,
  independentJurisdictionCreated: false,
  corporateLegalEntityOverridden: false,
});
