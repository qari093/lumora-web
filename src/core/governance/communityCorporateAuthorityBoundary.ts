export type CommunityCorporateDecisionClass =
  | "community_policy"
  | "community_moderation"
  | "community_program"
  | "corporate_fiduciary"
  | "corporate_statutory"
  | "regulatory_compliance"
  | "contractual_obligation"
  | "platform_treasury"
  | "community_budget_advisory";

export type CommunityCorporateAuthorityInput = {
  authenticated?: boolean;
  explicitlyDelegated?: boolean;
  decisionClass?: CommunityCorporateDecisionClass;

  communityRoleClaimed?: boolean;
  communityApprovalClaimed?: boolean;

  corporateLegalActorAuthorized?: boolean;
  treasuryAuthorityExplicitlyDelegated?: boolean;

  attemptsToOverrideCorporateDuty?: boolean;
  attemptsToCreateStateAuthority?: boolean;
  attemptsToCreateLegalSovereignty?: boolean;
  attemptsToCreateTokenVotingAuthority?: boolean;
  attemptsToCreateUnboundedTreasuryAuthority?: boolean;

  documentedPurpose?: boolean;
  scopeDefined?: boolean;
  auditRequired?: boolean;
};

export type CommunityCorporateAuthorityDecision = {
  allowed: boolean;

  communityAuthorityRecognized: boolean;
  corporateAuthorityRecognized: boolean;
  treasuryAuthorityRecognized: boolean;

  communityCanOverrideCorporateLegalDuty: false;
  communityMembershipCreatesStateAuthority: false;
  communityMembershipCreatesLegalSovereignty: false;
  tokenBalanceCreatesGovernanceAuthority: false;
  unboundedTreasuryAuthorityAllowed: false;

  reason:
    | "authentication_required"
    | "explicit_delegation_required"
    | "decision_class_required"
    | "state_authority_creation_blocked"
    | "legal_sovereignty_creation_blocked"
    | "corporate_duty_override_blocked"
    | "token_voting_authority_blocked"
    | "unbounded_treasury_authority_blocked"
    | "corporate_legal_actor_required"
    | "treasury_delegation_required"
    | "documented_purpose_required"
    | "scope_required"
    | "audit_required"
    | "community_authority_allowed"
    | "corporate_authority_allowed"
    | "treasury_authority_allowed";
};

const CORPORATE_LEGAL_CLASSES =
  new Set<CommunityCorporateDecisionClass>([
    "corporate_fiduciary",
    "corporate_statutory",
    "regulatory_compliance",
    "contractual_obligation",
  ]);

const COMMUNITY_CLASSES =
  new Set<CommunityCorporateDecisionClass>([
    "community_policy",
    "community_moderation",
    "community_program",
    "community_budget_advisory",
  ]);

const baseDecision = (
  reason: CommunityCorporateAuthorityDecision["reason"],
): CommunityCorporateAuthorityDecision => ({
  allowed: false,

  communityAuthorityRecognized: false,
  corporateAuthorityRecognized: false,
  treasuryAuthorityRecognized: false,

  communityCanOverrideCorporateLegalDuty: false,
  communityMembershipCreatesStateAuthority: false,
  communityMembershipCreatesLegalSovereignty: false,
  tokenBalanceCreatesGovernanceAuthority: false,
  unboundedTreasuryAuthorityAllowed: false,

  reason,
});

export function evaluateCommunityCorporateAuthorityBoundary(
  input: CommunityCorporateAuthorityInput,
): CommunityCorporateAuthorityDecision {
  if (input.authenticated !== true) {
    return baseDecision("authentication_required");
  }

  if (input.explicitlyDelegated !== true) {
    return baseDecision("explicit_delegation_required");
  }

  if (!input.decisionClass) {
    return baseDecision("decision_class_required");
  }

  if (input.attemptsToCreateStateAuthority === true) {
    return baseDecision("state_authority_creation_blocked");
  }

  if (input.attemptsToCreateLegalSovereignty === true) {
    return baseDecision("legal_sovereignty_creation_blocked");
  }

  if (input.attemptsToOverrideCorporateDuty === true) {
    return baseDecision("corporate_duty_override_blocked");
  }

  if (input.attemptsToCreateTokenVotingAuthority === true) {
    return baseDecision("token_voting_authority_blocked");
  }

  if (input.attemptsToCreateUnboundedTreasuryAuthority === true) {
    return baseDecision("unbounded_treasury_authority_blocked");
  }

  if (input.documentedPurpose !== true) {
    return baseDecision("documented_purpose_required");
  }

  if (input.scopeDefined !== true) {
    return baseDecision("scope_required");
  }

  if (input.auditRequired !== true) {
    return baseDecision("audit_required");
  }

  if (CORPORATE_LEGAL_CLASSES.has(input.decisionClass)) {
    if (input.corporateLegalActorAuthorized !== true) {
      return baseDecision("corporate_legal_actor_required");
    }

    return {
      ...baseDecision("corporate_authority_allowed"),
      allowed: true,
      corporateAuthorityRecognized: true,
    };
  }

  if (input.decisionClass === "platform_treasury") {
    if (
      input.corporateLegalActorAuthorized !== true ||
      input.treasuryAuthorityExplicitlyDelegated !== true
    ) {
      return baseDecision("treasury_delegation_required");
    }

    return {
      ...baseDecision("treasury_authority_allowed"),
      allowed: true,
      corporateAuthorityRecognized: true,
      treasuryAuthorityRecognized: true,
    };
  }

  if (COMMUNITY_CLASSES.has(input.decisionClass)) {
    return {
      ...baseDecision("community_authority_allowed"),
      allowed: true,
      communityAuthorityRecognized: true,
    };
  }

  return baseDecision("decision_class_required");
}

export const MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT =
  Object.freeze({
    communityMembershipIsNotLegalCitizenship: true,
    communityGovernanceDoesNotCreateStateAuthority: true,
    communityGovernanceDoesNotCreateLegalSovereignty: true,
    communityCannotOverrideCorporateLegalDuties: true,
    corporateLegalDutiesRemainWithAuthorizedLegalActors: true,
    treasuryAuthorityRequiresExplicitDelegation: true,
    unboundedTreasuryAuthorityAllowed: false,
    tokenVotingAuthorityCreated: false,
    newCouncilCreated: false,
    newElectionSystemCreated: false,
    privateBetaActivated: false,
  } as const);
