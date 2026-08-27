export const CONSEQUENTIAL_AUTOMATION_BOUNDARY_VERSION = "mega32-v1" as const;

export type AutomationDecisionClass =
  | "advisory"
  | "temporary_safety_gate"
  | "consequential";

export type ConsequentialAutomationBoundaryInput = {
  decisionClass: AutomationDecisionClass;
  producedByAutomation: boolean;
  humanReviewed?: boolean;
  irreversible?: boolean;
  removesRemedy?: boolean;
  altersGovernanceAuthority?: boolean;
  altersReputation?: boolean;
};

export type ConsequentialAutomationBoundaryDecision = {
  finalConsequentialActionAuthorized: boolean;
  humanReviewRequired: boolean;
  humanReviewSatisfied: boolean;
  automatedDecisionRemainsNonFinal: boolean;
  remedyMustRemainAvailable: boolean;
  governanceAuthorityMutationAllowed: boolean;
  secretReputationMutationAllowed: boolean;
  reason:
    | "non_consequential_advisory"
    | "temporary_safety_gate_requires_review_path"
    | "human_review_required"
    | "human_review_satisfied";
};

export function evaluateConsequentialAutomationBoundary(
  input: ConsequentialAutomationBoundaryInput,
): ConsequentialAutomationBoundaryDecision {
  const humanReviewed = input.humanReviewed === true;

  if (input.decisionClass === "advisory") {
    return {
      finalConsequentialActionAuthorized: false,
      humanReviewRequired: false,
      humanReviewSatisfied: false,
      automatedDecisionRemainsNonFinal: true,
      remedyMustRemainAvailable: true,
      governanceAuthorityMutationAllowed: false,
      secretReputationMutationAllowed: false,
      reason: "non_consequential_advisory",
    };
  }

  if (input.decisionClass === "temporary_safety_gate") {
    return {
      finalConsequentialActionAuthorized: false,
      humanReviewRequired: true,
      humanReviewSatisfied: humanReviewed,
      automatedDecisionRemainsNonFinal: true,
      remedyMustRemainAvailable: true,
      governanceAuthorityMutationAllowed: false,
      secretReputationMutationAllowed: false,
      reason: "temporary_safety_gate_requires_review_path",
    };
  }

  const prohibitedAutonomousMutation =
    input.producedByAutomation === true &&
    (
      input.irreversible === true ||
      input.removesRemedy === true ||
      input.altersGovernanceAuthority === true ||
      input.altersReputation === true
    );

  if (input.producedByAutomation && (!humanReviewed || prohibitedAutonomousMutation)) {
    return {
      finalConsequentialActionAuthorized: false,
      humanReviewRequired: true,
      humanReviewSatisfied: humanReviewed,
      automatedDecisionRemainsNonFinal: true,
      remedyMustRemainAvailable: true,
      governanceAuthorityMutationAllowed: false,
      secretReputationMutationAllowed: false,
      reason: "human_review_required",
    };
  }

  return {
    finalConsequentialActionAuthorized: true,
    humanReviewRequired: true,
    humanReviewSatisfied: true,
    automatedDecisionRemainsNonFinal: false,
    remedyMustRemainAvailable: true,
    governanceAuthorityMutationAllowed: false,
    secretReputationMutationAllowed: false,
    reason: "human_review_satisfied",
  };
}

export function assertConsequentialAutomationBoundary(): true {
  const automatedPermanent = evaluateConsequentialAutomationBoundary({
    decisionClass: "consequential",
    producedByAutomation: true,
    humanReviewed: false,
    irreversible: true,
  });

  if (automatedPermanent.finalConsequentialActionAuthorized) {
    throw new Error("automated irreversible action crossed human-review boundary");
  }

  const automatedGovernanceMutation = evaluateConsequentialAutomationBoundary({
    decisionClass: "consequential",
    producedByAutomation: true,
    humanReviewed: false,
    altersGovernanceAuthority: true,
  });

  if (automatedGovernanceMutation.governanceAuthorityMutationAllowed) {
    throw new Error("automation crossed governance-authority boundary");
  }

  const humanReviewed = evaluateConsequentialAutomationBoundary({
    decisionClass: "consequential",
    producedByAutomation: true,
    humanReviewed: true,
  });

  if (!humanReviewed.finalConsequentialActionAuthorized) {
    throw new Error("reviewed consequential action was not recognized");
  }

  return true;
}
