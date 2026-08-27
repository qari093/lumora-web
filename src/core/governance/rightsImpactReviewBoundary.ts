export const RIGHTS_IMPACT_REVIEW_BOUNDARY_VERSION = "mega37-v1" as const;

export type RightsImpactSeverity =
  | "none"
  | "low"
  | "moderate"
  | "high"
  | "fundamental";

export type RightsImpactDecisionReason =
  | "unauthenticated"
  | "explicit_delegation_required"
  | "action_description_required"
  | "legitimate_aim_required"
  | "affected_rights_required"
  | "evidence_required"
  | "necessity_not_established"
  | "less_restrictive_alternative_available"
  | "proportionality_not_established"
  | "fundamental_rights_reduction_blocked"
  | "safeguards_required"
  | "human_review_required"
  | "appeal_or_remedy_required"
  | "time_limit_required"
  | "review_date_required"
  | "transparency_record_required"
  | "conflict_review_required"
  | "authorized";

export interface RightsImpactReviewInput {
  authenticated: boolean;
  explicitlyDelegated: boolean;

  actionDescription: string;
  legitimateAim: string;

  affectedRights: string[];
  severity: RightsImpactSeverity;

  evidenceSummary: string;

  necessityEstablished: boolean;
  lessRestrictiveAlternativeAvailable: boolean;
  proportionalityEstablished: boolean;

  reducesFundamentalRights: boolean;

  safeguards: string[];
  humanReviewAvailable: boolean;
  appealOrRemedyAvailable: boolean;

  temporaryRestriction: boolean;
  timeLimit: string | null;
  reviewDate: string | null;

  transparencyRecordPlanned: boolean;

  reviewerConflictPresent: boolean;
  reviewerRecusedWhenRequired: boolean;
  independentReviewAvailable: boolean;
}

export interface RightsImpactReviewDecision {
  allowed: boolean;
  reason: RightsImpactDecisionReason;
  boundaryVersion: typeof RIGHTS_IMPACT_REVIEW_BOUNDARY_VERSION;

  necessityRequired: true;
  proportionalityRequired: true;
  leastRestrictiveMeansRequired: true;

  fundamentalRightsReductionAllowed: false;
  silentRightsRestrictionAllowed: false;
  indefiniteRestrictionAllowed: false;
  automatedFinalApprovalAllowed: false;

  humanReviewRequiredForConsequentialImpact: true;
  remedyRequiredForConsequentialImpact: true;
  transparencyRequired: true;
  conflictReviewRequired: true;
}

function textPresent(value: string): boolean {
  return value.trim().length > 0;
}

function listPresent(values: string[]): boolean {
  return values.some((value) => value.trim().length > 0);
}

function consequenceRequiresEnhancedSafeguards(
  severity: RightsImpactSeverity,
): boolean {
  return (
    severity === "moderate" ||
    severity === "high" ||
    severity === "fundamental"
  );
}

function decision(
  reason: RightsImpactDecisionReason,
): RightsImpactReviewDecision {
  return {
    allowed: reason === "authorized",
    reason,
    boundaryVersion: RIGHTS_IMPACT_REVIEW_BOUNDARY_VERSION,

    necessityRequired: true,
    proportionalityRequired: true,
    leastRestrictiveMeansRequired: true,

    fundamentalRightsReductionAllowed: false,
    silentRightsRestrictionAllowed: false,
    indefiniteRestrictionAllowed: false,
    automatedFinalApprovalAllowed: false,

    humanReviewRequiredForConsequentialImpact: true,
    remedyRequiredForConsequentialImpact: true,
    transparencyRequired: true,
    conflictReviewRequired: true,
  };
}

export function evaluateRightsImpactReview(
  input: RightsImpactReviewInput,
): RightsImpactReviewDecision {
  if (!input.authenticated) {
    return decision("unauthenticated");
  }

  if (!input.explicitlyDelegated) {
    return decision("explicit_delegation_required");
  }

  if (!textPresent(input.actionDescription)) {
    return decision("action_description_required");
  }

  if (!textPresent(input.legitimateAim)) {
    return decision("legitimate_aim_required");
  }

  if (!listPresent(input.affectedRights)) {
    return decision("affected_rights_required");
  }

  if (!textPresent(input.evidenceSummary)) {
    return decision("evidence_required");
  }

  if (!input.necessityEstablished) {
    return decision("necessity_not_established");
  }

  if (input.lessRestrictiveAlternativeAvailable) {
    return decision("less_restrictive_alternative_available");
  }

  if (!input.proportionalityEstablished) {
    return decision("proportionality_not_established");
  }

  if (input.reducesFundamentalRights || input.severity === "fundamental") {
    return decision("fundamental_rights_reduction_blocked");
  }

  const enhanced =
    consequenceRequiresEnhancedSafeguards(input.severity);

  if (enhanced && !listPresent(input.safeguards)) {
    return decision("safeguards_required");
  }

  if (enhanced && !input.humanReviewAvailable) {
    return decision("human_review_required");
  }

  if (enhanced && !input.appealOrRemedyAvailable) {
    return decision("appeal_or_remedy_required");
  }

  if (input.temporaryRestriction && !textPresent(input.timeLimit ?? "")) {
    return decision("time_limit_required");
  }

  if (enhanced && !textPresent(input.reviewDate ?? "")) {
    return decision("review_date_required");
  }

  if (!input.transparencyRecordPlanned) {
    return decision("transparency_record_required");
  }

  if (
    input.reviewerConflictPresent &&
    (!input.reviewerRecusedWhenRequired || !input.independentReviewAvailable)
  ) {
    return decision("conflict_review_required");
  }

  return decision("authorized");
}
