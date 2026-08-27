import { createHash } from "node:crypto";

export const CONSTITUTIONAL_AMENDMENT_BOUNDARY_VERSION =
  "mega36-v1" as const;

export type ConstitutionalAmendmentInput = {
  authenticated: boolean;
  delegatedAuthority: boolean;

  currentVersion: string;
  proposedVersion: string;

  documentedReason: string;
  effectiveDate: string;

  rightsImpactReviewCompleted: boolean;
  fundamentalRightsReduced?: boolean;

  conflictOfInterestPresent?: boolean;
  conflictDisclosed?: boolean;
  affectedPowerHolder?: boolean;
  actorRecused?: boolean;
  independentReviewCompleted?: boolean;

  publicChangeRecordPrepared: boolean;
  lawfulSafetyDisclosureExceptionDocumented?: boolean;

  previousVersionPreserved: boolean;
  appendOnlyHistory: boolean;

  previousVersionReference: string;
  previousVersionDigest: string;
  sealedVersionDigest: string;

  emergencyBypassRequested?: boolean;
};

export type ConstitutionalAmendmentReason =
  | "unauthenticated"
  | "explicit_delegation_required"
  | "current_version_required"
  | "new_version_identifier_required"
  | "same_version_mutation_blocked"
  | "documented_reason_required"
  | "valid_effective_date_required"
  | "rights_impact_review_required"
  | "fundamental_rights_reduction_blocked"
  | "conflict_disclosure_required"
  | "affected_power_holder_recusal_required"
  | "independent_review_required"
  | "public_change_record_required"
  | "previous_version_preservation_required"
  | "append_only_history_required"
  | "previous_version_reference_mismatch"
  | "previous_version_digest_invalid"
  | "sealed_version_digest_invalid"
  | "sealed_version_digest_mismatch"
  | "emergency_bypass_blocked"
  | "constitutional_amendment_authorized";

export type ConstitutionalAmendmentDecision = {
  allowed: boolean;
  reason: ConstitutionalAmendmentReason;

  authenticatedAuthorityRequired: true;
  explicitDelegationRequired: true;

  versionBumpRequired: true;
  sameVersionMutationAllowed: false;

  rightsImpactReviewRequired: true;
  fundamentalRightsReductionAllowed: false;

  conflictDisclosureRequired: boolean;
  recusalRequired: boolean;
  independentReviewRequired: boolean;
  unilateralAffectedPowerHolderVetoAllowed: false;

  publicChangeRecordRequired: true;

  previousVersionPreservationRequired: true;
  appendOnlyHistoryRequired: true;
  previousVersionReferenceRequired: true;
  cryptographicDigestRequired: true;
  silentRewriteAllowed: false;

  emergencyBypassAllowed: false;
  permanentAuthorityExpansionAllowed: false;

  expectedSealedVersionDigest: string | null;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isSha256(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

function isValidEffectiveDate(value: string): boolean {
  const normalized = clean(value);

  if (!normalized) {
    return false;
  }

  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp);
}

export function computeConstitutionalAmendmentDigest(
  input: Pick<
    ConstitutionalAmendmentInput,
    | "currentVersion"
    | "proposedVersion"
    | "documentedReason"
    | "effectiveDate"
    | "rightsImpactReviewCompleted"
    | "fundamentalRightsReduced"
    | "conflictOfInterestPresent"
    | "conflictDisclosed"
    | "affectedPowerHolder"
    | "actorRecused"
    | "independentReviewCompleted"
    | "publicChangeRecordPrepared"
    | "lawfulSafetyDisclosureExceptionDocumented"
    | "previousVersionPreserved"
    | "appendOnlyHistory"
    | "previousVersionReference"
    | "previousVersionDigest"
  >,
): string {
  const canonicalPayload = JSON.stringify({
    currentVersion: clean(input.currentVersion),
    proposedVersion: clean(input.proposedVersion),
    documentedReason: clean(input.documentedReason),
    effectiveDate: clean(input.effectiveDate),
    rightsImpactReviewCompleted:
      input.rightsImpactReviewCompleted === true,
    fundamentalRightsReduced:
      input.fundamentalRightsReduced === true,
    conflictOfInterestPresent:
      input.conflictOfInterestPresent === true,
    conflictDisclosed:
      input.conflictDisclosed === true,
    affectedPowerHolder:
      input.affectedPowerHolder === true,
    actorRecused:
      input.actorRecused === true,
    independentReviewCompleted:
      input.independentReviewCompleted === true,
    publicChangeRecordPrepared:
      input.publicChangeRecordPrepared === true,
    lawfulSafetyDisclosureExceptionDocumented:
      input.lawfulSafetyDisclosureExceptionDocumented === true,
    previousVersionPreserved:
      input.previousVersionPreserved === true,
    appendOnlyHistory:
      input.appendOnlyHistory === true,
    previousVersionReference:
      clean(input.previousVersionReference),
    previousVersionDigest:
      clean(input.previousVersionDigest).toLowerCase(),
  });

  return createHash("sha256")
    .update(canonicalPayload, "utf8")
    .digest("hex");
}

function decision(
  input: ConstitutionalAmendmentInput,
  reason: ConstitutionalAmendmentReason,
  expectedSealedVersionDigest: string | null = null,
): ConstitutionalAmendmentDecision {
  const materialConflict =
    input.conflictOfInterestPresent === true ||
    input.affectedPowerHolder === true;

  return {
    allowed: reason === "constitutional_amendment_authorized",
    reason,

    authenticatedAuthorityRequired: true,
    explicitDelegationRequired: true,

    versionBumpRequired: true,
    sameVersionMutationAllowed: false,

    rightsImpactReviewRequired: true,
    fundamentalRightsReductionAllowed: false,

    conflictDisclosureRequired: materialConflict,
    recusalRequired: materialConflict,
    independentReviewRequired: materialConflict,
    unilateralAffectedPowerHolderVetoAllowed: false,

    publicChangeRecordRequired: true,

    previousVersionPreservationRequired: true,
    appendOnlyHistoryRequired: true,
    previousVersionReferenceRequired: true,
    cryptographicDigestRequired: true,
    silentRewriteAllowed: false,

    emergencyBypassAllowed: false,
    permanentAuthorityExpansionAllowed: false,

    expectedSealedVersionDigest,
  };
}

export function evaluateConstitutionalAmendment(
  input: ConstitutionalAmendmentInput,
): ConstitutionalAmendmentDecision {
  if (input.authenticated !== true) {
    return decision(input, "unauthenticated");
  }

  if (input.delegatedAuthority !== true) {
    return decision(input, "explicit_delegation_required");
  }

  const currentVersion = clean(input.currentVersion);
  const proposedVersion = clean(input.proposedVersion);

  if (!currentVersion) {
    return decision(input, "current_version_required");
  }

  if (!proposedVersion) {
    return decision(input, "new_version_identifier_required");
  }

  if (currentVersion === proposedVersion) {
    return decision(input, "same_version_mutation_blocked");
  }

  if (!clean(input.documentedReason)) {
    return decision(input, "documented_reason_required");
  }

  if (!isValidEffectiveDate(input.effectiveDate)) {
    return decision(input, "valid_effective_date_required");
  }

  if (input.rightsImpactReviewCompleted !== true) {
    return decision(input, "rights_impact_review_required");
  }

  if (input.fundamentalRightsReduced === true) {
    return decision(input, "fundamental_rights_reduction_blocked");
  }

  const materialConflict =
    input.conflictOfInterestPresent === true ||
    input.affectedPowerHolder === true;

  if (
    materialConflict &&
    input.conflictDisclosed !== true
  ) {
    return decision(input, "conflict_disclosure_required");
  }

  if (
    input.affectedPowerHolder === true &&
    input.actorRecused !== true
  ) {
    return decision(
      input,
      "affected_power_holder_recusal_required",
    );
  }

  if (
    materialConflict &&
    input.actorRecused !== true
  ) {
    return decision(input, "affected_power_holder_recusal_required");
  }

  if (
    materialConflict &&
    input.independentReviewCompleted !== true
  ) {
    return decision(input, "independent_review_required");
  }

  if (
    input.publicChangeRecordPrepared !== true &&
    input.lawfulSafetyDisclosureExceptionDocumented !== true
  ) {
    return decision(input, "public_change_record_required");
  }

  if (input.previousVersionPreserved !== true) {
    return decision(input, "previous_version_preservation_required");
  }

  if (input.appendOnlyHistory !== true) {
    return decision(input, "append_only_history_required");
  }

  if (clean(input.previousVersionReference) !== currentVersion) {
    return decision(input, "previous_version_reference_mismatch");
  }

  const previousDigest = clean(input.previousVersionDigest);

  if (!isSha256(previousDigest)) {
    return decision(input, "previous_version_digest_invalid");
  }

  const sealedDigest = clean(input.sealedVersionDigest);

  if (!isSha256(sealedDigest)) {
    return decision(input, "sealed_version_digest_invalid");
  }

  if (input.emergencyBypassRequested === true) {
    return decision(input, "emergency_bypass_blocked");
  }

  const expectedSealedVersionDigest =
    computeConstitutionalAmendmentDigest(input);

  if (
    sealedDigest.toLowerCase() !==
    expectedSealedVersionDigest.toLowerCase()
  ) {
    return decision(
      input,
      "sealed_version_digest_mismatch",
      expectedSealedVersionDigest,
    );
  }

  return decision(
    input,
    "constitutional_amendment_authorized",
    expectedSealedVersionDigest,
  );
}

export function assertConstitutionalAmendmentBoundary(): true {
  const previousVersionDigest = "a".repeat(64);

  const base: ConstitutionalAmendmentInput = {
    authenticated: true,
    delegatedAuthority: true,
    currentVersion: "1.0.0",
    proposedVersion: "1.1.0",
    documentedReason: "Clarify constitutional safeguards.",
    effectiveDate: "2026-09-01T00:00:00.000Z",
    rightsImpactReviewCompleted: true,
    fundamentalRightsReduced: false,
    conflictOfInterestPresent: false,
    conflictDisclosed: false,
    affectedPowerHolder: false,
    actorRecused: false,
    independentReviewCompleted: false,
    publicChangeRecordPrepared: true,
    lawfulSafetyDisclosureExceptionDocumented: false,
    previousVersionPreserved: true,
    appendOnlyHistory: true,
    previousVersionReference: "1.0.0",
    previousVersionDigest,
    sealedVersionDigest: "",
    emergencyBypassRequested: false,
  };

  const sealedVersionDigest =
    computeConstitutionalAmendmentDigest(base);

  const valid = evaluateConstitutionalAmendment({
    ...base,
    sealedVersionDigest,
  });

  if (
    valid.allowed !== true ||
    valid.sameVersionMutationAllowed !== false ||
    valid.silentRewriteAllowed !== false ||
    valid.emergencyBypassAllowed !== false ||
    valid.permanentAuthorityExpansionAllowed !== false
  ) {
    throw new Error(
      "constitutional amendment authorization contract violated",
    );
  }

  const silentRewrite = evaluateConstitutionalAmendment({
    ...base,
    proposedVersion: base.currentVersion,
    sealedVersionDigest,
  });

  if (
    silentRewrite.allowed !== false ||
    silentRewrite.reason !== "same_version_mutation_blocked"
  ) {
    throw new Error(
      "same-version constitutional rewrite was not blocked",
    );
  }

  const emergencyBypassInput = {
    ...base,
    emergencyBypassRequested: true,
  };

  const emergencyBypass = evaluateConstitutionalAmendment({
    ...emergencyBypassInput,
    sealedVersionDigest:
      computeConstitutionalAmendmentDigest(
        emergencyBypassInput,
      ),
  });

  if (
    emergencyBypass.allowed !== false ||
    emergencyBypass.emergencyBypassAllowed !== false
  ) {
    throw new Error(
      "emergency bypass of permanent amendment controls was not blocked",
    );
  }

  return true;
}

assertConstitutionalAmendmentBoundary();
