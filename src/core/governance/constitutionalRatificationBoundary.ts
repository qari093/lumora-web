export const CONSTITUTIONAL_RATIFICATION_BOUNDARY_VERSION =
  "mega38-v1" as const;

export type ConstitutionalRatificationReason =
  | "authorized"
  | "authentication_required"
  | "explicit_delegation_required"
  | "current_version_required"
  | "proposed_version_required"
  | "version_change_required"
  | "reason_required"
  | "amendment_digest_required"
  | "previous_version_digest_required"
  | "rights_impact_review_required"
  | "rights_impact_approval_required"
  | "independent_review_required"
  | "conflict_disclosure_required"
  | "recusal_required"
  | "review_window_required"
  | "approval_threshold_required"
  | "public_change_record_required"
  | "previous_version_preservation_required"
  | "effective_date_required"
  | "affected_power_holder_sole_ratification_blocked"
  | "fundamental_rights_reduction_blocked"
  | "emergency_bypass_blocked";

export interface ConstitutionalRatificationInput {
  authenticated: boolean;
  explicitlyDelegated: boolean;

  currentVersion: string;
  proposedVersion: string;
  reason: string;

  amendmentDigest: string;
  previousVersionDigest: string;

  rightsImpactReviewCompleted: boolean;
  rightsImpactReviewApproved: boolean;

  independentReviewCompleted: boolean;

  conflictsDisclosed: boolean;
  reviewerConflictPresent: boolean;
  recusalCompletedWhenRequired: boolean;

  reviewWindowCompleted: boolean;
  approvalThresholdMet: boolean;

  publicChangeRecordPrepared: boolean;
  previousVersionPreserved: boolean;

  effectiveDate: string | null;

  affectedPowerHolderSoleApproval: boolean;
  fundamentalRightsReduction: boolean;
  emergencyBypassRequested: boolean;
}

export interface ConstitutionalRatificationDecision {
  allowed: boolean;
  reason: ConstitutionalRatificationReason;

  boundaryVersion: typeof CONSTITUTIONAL_RATIFICATION_BOUNDARY_VERSION;

  authenticationRequired: true;
  explicitDelegationRequired: true;
  versionChangeRequired: true;
  sealedAmendmentDigestRequired: true;
  previousVersionDigestRequired: true;

  rightsImpactReviewRequired: true;
  rightsImpactApprovalRequired: true;
  independentReviewRequired: true;
  conflictDisclosureRequired: true;
  recusalRequiredWhenConflicted: true;

  reviewWindowRequired: true;
  approvalThresholdRequired: true;
  publicChangeRecordRequired: true;
  previousVersionPreservationRequired: true;
  effectiveDateRequired: true;

  affectedPowerHolderCannotUnilaterallyRatify: true;
  fundamentalRightsReductionAllowed: false;
  emergencyBypassAllowed: false;
  silentRatificationAllowed: false;
}

const SHA256_PATTERN = /^[a-f0-9]{64}$/i;

function textPresent(value: string): boolean {
  return value.trim().length > 0;
}

function digestValid(value: string): boolean {
  return SHA256_PATTERN.test(value.trim());
}

function validDate(value: string | null): boolean {
  if (!value || !textPresent(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

function decision(
  reason: ConstitutionalRatificationReason,
): ConstitutionalRatificationDecision {
  return {
    allowed: reason === "authorized",
    reason,

    boundaryVersion: CONSTITUTIONAL_RATIFICATION_BOUNDARY_VERSION,

    authenticationRequired: true,
    explicitDelegationRequired: true,
    versionChangeRequired: true,
    sealedAmendmentDigestRequired: true,
    previousVersionDigestRequired: true,

    rightsImpactReviewRequired: true,
    rightsImpactApprovalRequired: true,
    independentReviewRequired: true,
    conflictDisclosureRequired: true,
    recusalRequiredWhenConflicted: true,

    reviewWindowRequired: true,
    approvalThresholdRequired: true,
    publicChangeRecordRequired: true,
    previousVersionPreservationRequired: true,
    effectiveDateRequired: true,

    affectedPowerHolderCannotUnilaterallyRatify: true,
    fundamentalRightsReductionAllowed: false,
    emergencyBypassAllowed: false,
    silentRatificationAllowed: false,
  };
}

export function evaluateConstitutionalRatification(
  input: ConstitutionalRatificationInput,
): ConstitutionalRatificationDecision {
  if (!input.authenticated) {
    return decision("authentication_required");
  }

  if (!input.explicitlyDelegated) {
    return decision("explicit_delegation_required");
  }

  if (!textPresent(input.currentVersion)) {
    return decision("current_version_required");
  }

  if (!textPresent(input.proposedVersion)) {
    return decision("proposed_version_required");
  }

  if (input.currentVersion.trim() === input.proposedVersion.trim()) {
    return decision("version_change_required");
  }

  if (!textPresent(input.reason)) {
    return decision("reason_required");
  }

  if (!digestValid(input.amendmentDigest)) {
    return decision("amendment_digest_required");
  }

  if (!digestValid(input.previousVersionDigest)) {
    return decision("previous_version_digest_required");
  }

  if (!input.rightsImpactReviewCompleted) {
    return decision("rights_impact_review_required");
  }

  if (!input.rightsImpactReviewApproved) {
    return decision("rights_impact_approval_required");
  }

  if (!input.independentReviewCompleted) {
    return decision("independent_review_required");
  }

  if (!input.conflictsDisclosed) {
    return decision("conflict_disclosure_required");
  }

  if (
    input.reviewerConflictPresent &&
    !input.recusalCompletedWhenRequired
  ) {
    return decision("recusal_required");
  }

  if (!input.reviewWindowCompleted) {
    return decision("review_window_required");
  }

  if (!input.approvalThresholdMet) {
    return decision("approval_threshold_required");
  }

  if (!input.publicChangeRecordPrepared) {
    return decision("public_change_record_required");
  }

  if (!input.previousVersionPreserved) {
    return decision("previous_version_preservation_required");
  }

  if (!validDate(input.effectiveDate)) {
    return decision("effective_date_required");
  }

  if (input.affectedPowerHolderSoleApproval) {
    return decision("affected_power_holder_sole_ratification_blocked");
  }

  if (input.fundamentalRightsReduction) {
    return decision("fundamental_rights_reduction_blocked");
  }

  if (input.emergencyBypassRequested) {
    return decision("emergency_bypass_blocked");
  }

  return decision("authorized");
}
