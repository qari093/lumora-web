import { describe, expect, it } from "vitest";
import {
  assertEmergencyAuthorityBoundary,
  evaluateEmergencyAuthority,
} from "../../src/core/governance/emergencyAuthorityBoundary";

function validInput() {
  return {
    authenticated: true,
    explicitlyDelegated: true,
    emergencyDeclared: true,
    documentedReason: true,
    necessityEstablished: true,
    ordinaryProcessInsufficient: true,
    narrowScope: true,
    proportionate: true,
    temporary: true,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    reviewPathAvailable: true,
    remedyAvailable: true,
    auditRequired: true,
  } as const;
}

describe("Mega33 emergency authority constitutional boundary", () => {
  it("authorizes only temporary reviewable emergency authority", () => {
    const decision = evaluateEmergencyAuthority(validInput());

    expect(decision.allowed).toBe(true);
    expect(decision.emergencyAuthorityActive).toBe(true);
    expect(decision.decisionFinality).toBe("temporary_reviewable");
    expect(decision.permanentGovernanceAuthorityGranted).toBe(false);
    expect(decision.irreversibleGovernanceMutationAllowed).toBe(false);
    expect(decision.fundamentalRightsRemainInForce).toBe(true);
    expect(decision.remedyMustRemainAvailable).toBe(true);
  });

  it("rejects unauthenticated emergency authority", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        authenticated: false,
      }).reason,
    ).toBe("unauthenticated");
  });

  it("rejects authority without explicit delegation", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        explicitlyDelegated: false,
      }).reason,
    ).toBe("not_explicitly_delegated");
  });

  it("requires a declared emergency", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        emergencyDeclared: false,
      }).reason,
    ).toBe("no_declared_emergency");
  });

  it("requires documented necessity", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        necessityEstablished: false,
      }).reason,
    ).toBe("necessity_not_established");
  });

  it("rejects emergency use when ordinary process remains sufficient", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        ordinaryProcessInsufficient: false,
      }).reason,
    ).toBe("ordinary_process_available");
  });

  it("requires narrow and proportionate authority", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        narrowScope: false,
      }).reason,
    ).toBe("scope_not_narrow");

    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        proportionate: false,
      }).reason,
    ).toBe("not_proportionate");
  });

  it("requires temporary authority with a future sunset", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        temporary: false,
      }).reason,
    ).toBe("not_temporary");

    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        expiresAt: new Date(Date.now() - 60_000).toISOString(),
      }).reason,
    ).toBe("sunset_missing_or_expired");
  });

  it("requires human review and remedy", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        reviewPathAvailable: false,
      }).reason,
    ).toBe("review_path_missing");

    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        remedyAvailable: false,
      }).reason,
    ).toBe("remedy_missing");
  });

  it("requires auditable emergency action", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        auditRequired: false,
      }).reason,
    ).toBe("audit_missing");
  });

  it("does not permit suspension of fundamental rights", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        attemptsToSuspendFundamentalRights: true,
      }).reason,
    ).toBe("fundamental_rights_cannot_be_suspended");
  });

  it("does not permit irreversible governance mutation", () => {
    expect(
      evaluateEmergencyAuthority({
        ...validInput(),
        attemptsIrreversibleGovernanceMutation: true,
      }).reason,
    ).toBe("irreversible_governance_mutation_forbidden");
  });

  it("does not convert emergency authority into permanent authority", () => {
    const decision = evaluateEmergencyAuthority({
      ...validInput(),
      attemptsPermanentAuthorityExpansion: true,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("permanent_authority_expansion_forbidden");
    expect(decision.permanentGovernanceAuthorityGranted).toBe(false);
  });

  it("passes built-in constitutional assertions", () => {
    expect(assertEmergencyAuthorityBoundary()).toBe(true);
  });
});
