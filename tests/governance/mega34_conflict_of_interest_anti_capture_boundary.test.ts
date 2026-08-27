import { describe, expect, it } from "vitest";

import {
  evaluateConflictOfInterestBoundary,
} from "../../src/core/governance/conflictOfInterestBoundary";

describe("Mega34 conflict-of-interest anti-capture boundary", () => {
  it("blocks unauthenticated consequential authority", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: false,
      delegatedAuthority: true,
      decisionClass: "consequential",
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("authentication_required");
  });

  it("blocks authority without explicit delegation", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: false,
      decisionClass: "consequential",
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("explicit_delegation_required");
  });

  it("allows clean authenticated delegated consequential authority", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
      actorUserId: "reviewer",
      affectedUserId: "member",
    });

    expect(result.allowed).toBe(true);
    expect(result.conflictDetected).toBe(false);
  });

  it("detects direct self-review", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
      actorUserId: "member",
      affectedUserId: "member",
    });

    expect(result.selfDealingDetected).toBe(true);
    expect(result.allowed).toBe(false);
  });

  it("blocks direct-benefit self-dealing", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
      actorWouldDirectlyBenefit: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("self_dealing_blocked");
  });

  it("requires conflict disclosure", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
      declaredConflictOfInterest: true,
      conflictDisclosed: false,
      actorRecused: true,
      independentReviewerAvailable: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("conflict_disclosure_required");
  });

  it("requires recusal for a disclosed conflict", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
      declaredConflictOfInterest: true,
      conflictDisclosed: true,
      actorRecused: false,
      independentReviewerAvailable: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("recusal_required");
  });

  it("requires independent review when conflicted", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
      declaredConflictOfInterest: true,
      conflictDisclosed: true,
      actorRecused: true,
      independentReviewerAvailable: false,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("independent_review_required");
  });

  it("allows a disclosed conflict only after recusal and independent review", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
      declaredConflictOfInterest: true,
      conflictDisclosed: true,
      actorRecused: true,
      independentReviewerAvailable: true,
    });

    expect(result.allowed).toBe(true);
  });

  it("blocks unilateral control by an affected constitutional power holder", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "constitutional_amendment",
      actorPowerPersonallyAffected: true,
      conflictDisclosed: true,
      actorRecused: false,
      independentReviewerAvailable: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.unilateralVetoAllowed).toBe(false);
  });

  it("never enables permanent authority expansion", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
    });

    expect(result.permanentAuthorityExpansionAllowed).toBe(false);
  });

  it("keeps unilateral veto disabled even for clean delegated actors", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "constitutional_amendment",
    });

    expect(result.unilateralVetoAllowed).toBe(false);
  });

  it("does not turn advisory evaluation into consequential authority", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "advisory",
      declaredConflictOfInterest: true,
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("advisory_non_consequential");
    expect(result.permanentAuthorityExpansionAllowed).toBe(false);
  });

  it("preserves fail-closed treatment for conflicted consequential decisions", () => {
    const result = evaluateConflictOfInterestBoundary({
      authenticated: true,
      delegatedAuthority: true,
      decisionClass: "consequential",
      actorPowerPersonallyAffected: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.disclosureRequired).toBe(true);
    expect(result.recusalRequired).toBe(true);
    expect(result.independentReviewRequired).toBe(true);
  });
});
