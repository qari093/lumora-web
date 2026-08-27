import { createHash } from "node:crypto";

export const GOVERNANCE_DECISION_PUBLICATION_VERSION =
  "mega40-v1" as const;

export type GovernanceDecisionPublicationReason =
  | "published"
  | "decision_id_required"
  | "decision_type_required"
  | "decision_summary_required"
  | "decision_reason_required"
  | "decision_date_required"
  | "effective_date_required"
  | "authority_basis_required"
  | "review_path_required"
  | "remedy_path_required"
  | "rights_impact_status_required"
  | "conflict_review_status_required"
  | "public_accountability_record_required"
  | "sensitive_data_detected"
  | "secret_or_internal_only_metadata_detected";

export interface GovernanceDecisionPublicationInput {
  decisionId: string;
  decisionType: string;
  decisionSummary: string;
  decisionReason: string;
  decisionDate: string;
  effectiveDate: string;
  authorityBasis: string;
  reviewPath: string;
  remedyPath: string;
  rightsImpactStatus: string;
  conflictReviewStatus: string;
  publicAccountabilityRecord: string;
  metadata?: Record<string, unknown> | null;
}

export interface GovernanceDecisionPublicationDecision {
  allowed: boolean;
  reason: GovernanceDecisionPublicationReason;
  boundaryVersion: typeof GOVERNANCE_DECISION_PUBLICATION_VERSION;
  publicationRequired: true;
  explanationRequired: true;
  reviewPathRequired: true;
  remedyPathRequired: true;
  rightsImpactVisibilityRequired: true;
  conflictReviewVisibilityRequired: true;
  authorityBasisVisibilityRequired: true;
  secretInternalMetadataPublicationAllowed: false;
  hiddenConsequentialDecisionAllowed: false;
  deterministicDigest: string | null;
}

function textPresent(value: string): boolean {
  return value.trim().length > 0;
}

function safeMetadata(metadata?: Record<string, unknown> | null): boolean {
  if (!metadata) return true;

  const serialized = JSON.stringify(metadata).toLowerCase();

  const prohibited = [
    "password",
    "secret",
    "token",
    "api_key",
    "apikey",
    "authorization",
    "cookie",
    "session",
    "private_key",
    "access_key",
    "credential",
  ];

  return prohibited.every((marker) => !serialized.includes(marker));
}

function digestInput(input: GovernanceDecisionPublicationInput): string {
  const canonical = JSON.stringify({
    decisionId: input.decisionId.trim(),
    decisionType: input.decisionType.trim(),
    decisionSummary: input.decisionSummary.trim(),
    decisionReason: input.decisionReason.trim(),
    decisionDate: input.decisionDate.trim(),
    effectiveDate: input.effectiveDate.trim(),
    authorityBasis: input.authorityBasis.trim(),
    reviewPath: input.reviewPath.trim(),
    remedyPath: input.remedyPath.trim(),
    rightsImpactStatus: input.rightsImpactStatus.trim(),
    conflictReviewStatus: input.conflictReviewStatus.trim(),
    publicAccountabilityRecord: input.publicAccountabilityRecord.trim(),
  });

  return createHash("sha256").update(canonical).digest("hex");
}

function result(
  allowed: boolean,
  reason: GovernanceDecisionPublicationReason,
  digest: string | null = null,
): GovernanceDecisionPublicationDecision {
  return {
    allowed,
    reason,
    boundaryVersion: GOVERNANCE_DECISION_PUBLICATION_VERSION,
    publicationRequired: true,
    explanationRequired: true,
    reviewPathRequired: true,
    remedyPathRequired: true,
    rightsImpactVisibilityRequired: true,
    conflictReviewVisibilityRequired: true,
    authorityBasisVisibilityRequired: true,
    secretInternalMetadataPublicationAllowed: false,
    hiddenConsequentialDecisionAllowed: false,
    deterministicDigest: digest,
  };
}

export function evaluateGovernanceDecisionPublication(
  input: GovernanceDecisionPublicationInput,
): GovernanceDecisionPublicationDecision {
  if (!textPresent(input.decisionId)) {
    return result(false, "decision_id_required");
  }

  if (!textPresent(input.decisionType)) {
    return result(false, "decision_type_required");
  }

  if (!textPresent(input.decisionSummary)) {
    return result(false, "decision_summary_required");
  }

  if (!textPresent(input.decisionReason)) {
    return result(false, "decision_reason_required");
  }

  if (!textPresent(input.decisionDate)) {
    return result(false, "decision_date_required");
  }

  if (!textPresent(input.effectiveDate)) {
    return result(false, "effective_date_required");
  }

  if (!textPresent(input.authorityBasis)) {
    return result(false, "authority_basis_required");
  }

  if (!textPresent(input.reviewPath)) {
    return result(false, "review_path_required");
  }

  if (!textPresent(input.remedyPath)) {
    return result(false, "remedy_path_required");
  }

  if (!textPresent(input.rightsImpactStatus)) {
    return result(false, "rights_impact_status_required");
  }

  if (!textPresent(input.conflictReviewStatus)) {
    return result(false, "conflict_review_status_required");
  }

  if (!textPresent(input.publicAccountabilityRecord)) {
    return result(false, "public_accountability_record_required");
  }

  if (!safeMetadata(input.metadata)) {
    return result(false, "secret_or_internal_only_metadata_detected");
  }

  return result(true, "published", digestInput(input));
}
