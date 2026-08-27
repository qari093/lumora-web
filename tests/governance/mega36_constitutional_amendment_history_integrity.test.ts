import fs from "node:fs";

import {
  assertConstitutionalAmendmentBoundary,
  computeConstitutionalAmendmentDigest,
  evaluateConstitutionalAmendment,
  type ConstitutionalAmendmentInput,
} from "../../src/core/governance/constitutionalAmendmentBoundary";

function validInput(): ConstitutionalAmendmentInput {
  const base: ConstitutionalAmendmentInput = {
    authenticated: true,
    delegatedAuthority: true,

    currentVersion: "1.0.0",
    proposedVersion: "1.1.0",

    documentedReason:
      "Clarify constitutional accountability safeguards.",
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
    previousVersionDigest: "a".repeat(64),
    sealedVersionDigest: "",

    emergencyBypassRequested: false,
  };

  return {
    ...base,
    sealedVersionDigest:
      computeConstitutionalAmendmentDigest(base),
  };
}

describe(
  "Mega36 constitutional amendment versioning and history integrity boundary",
  () => {
    it("passes its invariant assertion", () => {
      expect(assertConstitutionalAmendmentBoundary()).toBe(true);
    });

    it("authorizes a complete digest-linked amendment", () => {
      const decision =
        evaluateConstitutionalAmendment(validInput());

      expect(decision.allowed).toBe(true);
      expect(decision.reason).toBe(
        "constitutional_amendment_authorized",
      );
      expect(decision.silentRewriteAllowed).toBe(false);
    });

    it("rejects unauthenticated amendment authority", () => {
      const decision = evaluateConstitutionalAmendment({
        ...validInput(),
        authenticated: false,
      });

      expect(decision.allowed).toBe(false);
      expect(decision.reason).toBe("unauthenticated");
    });

    it("rejects authority without explicit delegation", () => {
      const decision = evaluateConstitutionalAmendment({
        ...validInput(),
        delegatedAuthority: false,
      });

      expect(decision.allowed).toBe(false);
      expect(decision.reason).toBe(
        "explicit_delegation_required",
      );
    });

    it("blocks same-version silent rewriting", () => {
      const input = {
        ...validInput(),
        proposedVersion: "1.0.0",
      };

      const decision =
        evaluateConstitutionalAmendment(input);

      expect(decision.allowed).toBe(false);
      expect(decision.reason).toBe(
        "same_version_mutation_blocked",
      );
      expect(decision.sameVersionMutationAllowed).toBe(false);
    });

    it("requires a documented reason", () => {
      const decision = evaluateConstitutionalAmendment({
        ...validInput(),
        documentedReason: "",
      });

      expect(decision.reason).toBe(
        "documented_reason_required",
      );
    });

    it("requires rights-impact review", () => {
      const decision = evaluateConstitutionalAmendment({
        ...validInput(),
        rightsImpactReviewCompleted: false,
      });

      expect(decision.reason).toBe(
        "rights_impact_review_required",
      );
    });

    it("does not permit reduction of fundamental rights", () => {
      const decision = evaluateConstitutionalAmendment({
        ...validInput(),
        fundamentalRightsReduced: true,
      });

      expect(decision.reason).toBe(
        "fundamental_rights_reduction_blocked",
      );
      expect(
        decision.fundamentalRightsReductionAllowed,
      ).toBe(false);
    });

    it("requires disclosure, recusal and independent review for conflicts", () => {
      const undisclosed =
        evaluateConstitutionalAmendment({
          ...validInput(),
          conflictOfInterestPresent: true,
          conflictDisclosed: false,
        });

      expect(undisclosed.reason).toBe(
        "conflict_disclosure_required",
      );

      const notRecused =
        evaluateConstitutionalAmendment({
          ...validInput(),
          conflictOfInterestPresent: true,
          conflictDisclosed: true,
          actorRecused: false,
        });

      expect(notRecused.reason).toBe(
        "affected_power_holder_recusal_required",
      );

      const noIndependentReview =
        evaluateConstitutionalAmendment({
          ...validInput(),
          conflictOfInterestPresent: true,
          conflictDisclosed: true,
          actorRecused: true,
          independentReviewCompleted: false,
        });

      expect(noIndependentReview.reason).toBe(
        "independent_review_required",
      );
    });

    it("blocks affected power-holder unilateral amendment control", () => {
      const decision = evaluateConstitutionalAmendment({
        ...validInput(),
        affectedPowerHolder: true,
        conflictDisclosed: true,
        actorRecused: false,
        independentReviewCompleted: true,
      });

      expect(decision.allowed).toBe(false);
      expect(decision.unilateralAffectedPowerHolderVetoAllowed)
        .toBe(false);
    });

    it("requires preservation and append-only history", () => {
      const noPreservation =
        evaluateConstitutionalAmendment({
          ...validInput(),
          previousVersionPreserved: false,
        });

      expect(noPreservation.reason).toBe(
        "previous_version_preservation_required",
      );

      const nonAppendOnly =
        evaluateConstitutionalAmendment({
          ...validInput(),
          appendOnlyHistory: false,
        });

      expect(nonAppendOnly.reason).toBe(
        "append_only_history_required",
      );
    });

    it("requires exact previous-version linkage", () => {
      const decision = evaluateConstitutionalAmendment({
        ...validInput(),
        previousVersionReference: "0.9.0",
      });

      expect(decision.reason).toBe(
        "previous_version_reference_mismatch",
      );
    });

    it("detects sealed digest tampering", () => {
      const decision = evaluateConstitutionalAmendment({
        ...validInput(),
        sealedVersionDigest: "b".repeat(64),
      });

      expect(decision.allowed).toBe(false);
      expect(decision.reason).toBe(
        "sealed_version_digest_mismatch",
      );
    });

    it("blocks emergency bypass and exposes authenticated route contract", () => {
      const emergencyInput = {
        ...validInput(),
        emergencyBypassRequested: true,
      };

      emergencyInput.sealedVersionDigest =
        computeConstitutionalAmendmentDigest(
          emergencyInput,
        );

      const emergency =
        evaluateConstitutionalAmendment(
          emergencyInput,
        );

      expect(emergency.allowed).toBe(false);
      expect(emergency.reason).toBe(
        "emergency_bypass_blocked",
      );
      expect(emergency.emergencyBypassAllowed).toBe(false);

      const route = fs.readFileSync(
        "app/api/governance/constitutional-amendment-boundary/route.ts",
        "utf8",
      );

      expect(route).toContain("requireAdminSession");
      expect(route).toContain(
        'source: "canonical_admin_session"',
      );
      expect(route).toContain(
        "callerSuppliedIdentityAccepted: false",
      );
      expect(route).toContain(
        "callerSuppliedAuthorityAccepted: false",
      );
      expect(route).not.toContain(
        "body.authenticated",
      );
      expect(route).not.toContain(
        "body.delegatedAuthority",
      );
    });
  },
);
