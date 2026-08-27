import { describe, expect, it } from "vitest";

import {
  evaluateCommunityCorporateAuthorityBoundary,
  MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT,
} from "../../src/core/governance/communityCorporateAuthorityBoundary";

const cleanCommunity = {
  authenticated: true,
  explicitlyDelegated: true,
  decisionClass: "community_policy" as const,
  documentedPurpose: true,
  scopeDefined: true,
  auditRequired: true,
};

describe("Mega35 community/corporate authority separation", () => {
  it("fails closed without authentication", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        authenticated: false,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("authentication_required");
  });

  it("fails closed without explicit delegation", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        explicitlyDelegated: false,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("explicit_delegation_required");
  });

  it("allows scoped community policy authority", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary(cleanCommunity);

    expect(result.allowed).toBe(true);
    expect(result.communityAuthorityRecognized).toBe(true);
    expect(result.corporateAuthorityRecognized).toBe(false);
  });

  it("blocks creation of state authority", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        attemptsToCreateStateAuthority: true,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("state_authority_creation_blocked");
  });

  it("blocks creation of legal sovereignty", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        attemptsToCreateLegalSovereignty: true,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("legal_sovereignty_creation_blocked");
  });

  it("blocks community override of corporate legal duty", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        attemptsToOverrideCorporateDuty: true,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("corporate_duty_override_blocked");
    expect(result.communityCanOverrideCorporateLegalDuty).toBe(false);
  });

  it("requires an authorized legal actor for fiduciary decisions", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        decisionClass: "corporate_fiduciary",
        corporateLegalActorAuthorized: false,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("corporate_legal_actor_required");
  });

  it("allows explicitly authorized corporate legal authority", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        decisionClass: "regulatory_compliance",
        corporateLegalActorAuthorized: true,
      });

    expect(result.allowed).toBe(true);
    expect(result.corporateAuthorityRecognized).toBe(true);
    expect(result.communityAuthorityRecognized).toBe(false);
  });

  it("requires explicit treasury delegation", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        decisionClass: "platform_treasury",
        corporateLegalActorAuthorized: true,
        treasuryAuthorityExplicitlyDelegated: false,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("treasury_delegation_required");
  });

  it("allows only bounded explicitly delegated treasury authority", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        decisionClass: "platform_treasury",
        corporateLegalActorAuthorized: true,
        treasuryAuthorityExplicitlyDelegated: true,
      });

    expect(result.allowed).toBe(true);
    expect(result.treasuryAuthorityRecognized).toBe(true);
    expect(result.unboundedTreasuryAuthorityAllowed).toBe(false);
  });

  it("blocks unbounded treasury authority", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        decisionClass: "platform_treasury",
        corporateLegalActorAuthorized: true,
        treasuryAuthorityExplicitlyDelegated: true,
        attemptsToCreateUnboundedTreasuryAuthority: true,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe(
      "unbounded_treasury_authority_blocked",
    );
  });

  it("blocks token-voting authority creation", () => {
    const result =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        attemptsToCreateTokenVotingAuthority: true,
      });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("token_voting_authority_blocked");
    expect(result.tokenBalanceCreatesGovernanceAuthority).toBe(false);
  });

  it("requires documented purpose, scope, and auditability", () => {
    const noPurpose =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        documentedPurpose: false,
      });

    const noScope =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        scopeDefined: false,
      });

    const noAudit =
      evaluateCommunityCorporateAuthorityBoundary({
        ...cleanCommunity,
        auditRequired: false,
      });

    expect(noPurpose.reason).toBe("documented_purpose_required");
    expect(noScope.reason).toBe("scope_required");
    expect(noAudit.reason).toBe("audit_required");
  });

  it("preserves the constitutional non-expansion contract", () => {
    expect(
      MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT
        .communityMembershipIsNotLegalCitizenship,
    ).toBe(true);

    expect(
      MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT
        .communityGovernanceDoesNotCreateStateAuthority,
    ).toBe(true);

    expect(
      MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT
        .communityCannotOverrideCorporateLegalDuties,
    ).toBe(true);

    expect(
      MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT
        .treasuryAuthorityRequiresExplicitDelegation,
    ).toBe(true);

    expect(
      MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT
        .unboundedTreasuryAuthorityAllowed,
    ).toBe(false);

    expect(
      MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT
        .tokenVotingAuthorityCreated,
    ).toBe(false);

    expect(
      MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT
        .newCouncilCreated,
    ).toBe(false);

    expect(
      MEGA35_COMMUNITY_CORPORATE_AUTHORITY_CONTRACT
        .privateBetaActivated,
    ).toBe(false);
  });
});
