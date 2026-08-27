export type GovernanceDecisionClass =
  | "advisory"
  | "consequential"
  | "constitutional_amendment";

export type ConflictOfInterestBoundaryInput = {
  authenticated: boolean;
  delegatedAuthority: boolean;

  decisionClass: GovernanceDecisionClass;

  actorUserId?: string | null;
  affectedUserId?: string | null;

  declaredConflictOfInterest?: boolean;
  conflictDisclosed?: boolean;
  actorRecused?: boolean;
  independentReviewerAvailable?: boolean;

  actorWouldDirectlyBenefit?: boolean;
  actorPowerPersonallyAffected?: boolean;
};

export type ConflictOfInterestBoundaryDecision = {
  allowed: boolean;

  conflictDetected: boolean;
  selfDealingDetected: boolean;

  disclosureRequired: boolean;
  recusalRequired: boolean;
  independentReviewRequired: boolean;

  unilateralVetoAllowed: false;
  permanentAuthorityExpansionAllowed: false;

  reason:
    | "advisory_non_consequential"
    | "authenticated_delegated_no_conflict"
    | "authentication_required"
    | "explicit_delegation_required"
    | "conflict_disclosure_required"
    | "recusal_required"
    | "independent_review_required"
    | "self_dealing_blocked"
    | "affected_power_holder_cannot_unilaterally_control_outcome";
};

function normalized(value?: string | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function evaluateConflictOfInterestBoundary(
  input: ConflictOfInterestBoundaryInput,
): ConflictOfInterestBoundaryDecision {
  const actorUserId = normalized(input.actorUserId);
  const affectedUserId = normalized(input.affectedUserId);

  const samePerson =
    actorUserId !== null &&
    affectedUserId !== null &&
    actorUserId === affectedUserId;

  const selfDealingDetected =
    samePerson || input.actorWouldDirectlyBenefit === true;

  const conflictDetected =
    input.declaredConflictOfInterest === true ||
    selfDealingDetected ||
    input.actorPowerPersonallyAffected === true;

  const consequential =
    input.decisionClass === "consequential" ||
    input.decisionClass === "constitutional_amendment";

  const disclosureRequired = consequential && conflictDetected;
  const recusalRequired = consequential && conflictDetected;
  const independentReviewRequired = consequential && conflictDetected;

  const base = {
    conflictDetected,
    selfDealingDetected,
    disclosureRequired,
    recusalRequired,
    independentReviewRequired,
    unilateralVetoAllowed: false as const,
    permanentAuthorityExpansionAllowed: false as const,
  };

  if (!input.authenticated) {
    return {
      ...base,
      allowed: false,
      reason: "authentication_required",
    };
  }

  if (!input.delegatedAuthority) {
    return {
      ...base,
      allowed: false,
      reason: "explicit_delegation_required",
    };
  }

  if (!consequential) {
    return {
      ...base,
      allowed: true,
      reason: "advisory_non_consequential",
    };
  }

  if (
    input.decisionClass === "constitutional_amendment" &&
    input.actorPowerPersonallyAffected === true &&
    input.actorRecused !== true
  ) {
    return {
      ...base,
      allowed: false,
      reason: "affected_power_holder_cannot_unilaterally_control_outcome",
    };
  }

  if (selfDealingDetected && input.actorRecused !== true) {
    return {
      ...base,
      allowed: false,
      reason: "self_dealing_blocked",
    };
  }

  if (conflictDetected && input.conflictDisclosed !== true) {
    return {
      ...base,
      allowed: false,
      reason: "conflict_disclosure_required",
    };
  }

  if (conflictDetected && input.actorRecused !== true) {
    return {
      ...base,
      allowed: false,
      reason: "recusal_required",
    };
  }

  if (
    conflictDetected &&
    input.independentReviewerAvailable !== true
  ) {
    return {
      ...base,
      allowed: false,
      reason: "independent_review_required",
    };
  }

  return {
    ...base,
    allowed: true,
    reason: "authenticated_delegated_no_conflict",
  };
}

function assertBoundaryInvariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) throw new Error(message);
}

const selfReview = evaluateConflictOfInterestBoundary({
  authenticated: true,
  delegatedAuthority: true,
  decisionClass: "consequential",
  actorUserId: "same-user",
  affectedUserId: "same-user",
});

assertBoundaryInvariant(
  selfReview.allowed === false,
  "self_dealing_authority_was_not_blocked",
);

const undisclosedConflict = evaluateConflictOfInterestBoundary({
  authenticated: true,
  delegatedAuthority: true,
  decisionClass: "consequential",
  actorUserId: "reviewer",
  affectedUserId: "member",
  declaredConflictOfInterest: true,
  conflictDisclosed: false,
});

assertBoundaryInvariant(
  undisclosedConflict.allowed === false,
  "undisclosed_conflict_was_not_blocked",
);

const cleanDelegatedDecision = evaluateConflictOfInterestBoundary({
  authenticated: true,
  delegatedAuthority: true,
  decisionClass: "consequential",
  actorUserId: "reviewer",
  affectedUserId: "member",
});

assertBoundaryInvariant(
  cleanDelegatedDecision.allowed === true,
  "clean_delegated_decision_was_incorrectly_blocked",
);

const affectedAmendmentActor = evaluateConflictOfInterestBoundary({
  authenticated: true,
  delegatedAuthority: true,
  decisionClass: "constitutional_amendment",
  actorUserId: "power-holder",
  affectedUserId: "community",
  actorPowerPersonallyAffected: true,
});

assertBoundaryInvariant(
  affectedAmendmentActor.unilateralVetoAllowed === false &&
    affectedAmendmentActor.allowed === false,
  "affected_power_holder_received_unilateral_control",
);
