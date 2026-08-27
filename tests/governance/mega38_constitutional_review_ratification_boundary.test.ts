import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  CONSTITUTIONAL_RATIFICATION_BOUNDARY_VERSION,
  evaluateConstitutionalRatification,
  type ConstitutionalRatificationInput,
} from "@/src/core/governance/constitutionalRatificationBoundary";

const DIGEST_A = "a".repeat(64);
const DIGEST_B = "b".repeat(64);

function validInput(
  overrides: Partial<ConstitutionalRatificationInput> = {},
): ConstitutionalRatificationInput {
  return {
    authenticated: true,
    explicitlyDelegated: true,

    currentVersion: "constitution-v1",
    proposedVersion: "constitution-v2",
    reason: "Clarify platform due-process protections.",

    amendmentDigest: DIGEST_A,
    previousVersionDigest: DIGEST_B,

    rightsImpactReviewCompleted: true,
    rightsImpactReviewApproved: true,

    independentReviewCompleted: true,

    conflictsDisclosed: true,
    reviewerConflictPresent: false,
    recusalCompletedWhenRequired: true,

    reviewWindowCompleted: true,
    approvalThresholdMet: true,

    publicChangeRecordPrepared: true,
    previousVersionPreserved: true,

    effectiveDate: "2026-09-01T00:00:00.000Z",

    affectedPowerHolderSoleApproval: false,
    fundamentalRightsReduction: false,
    emergencyBypassRequested: false,

    ...overrides,
  };
}

describe("Mega38 constitutional review and ratification boundary", () => {
  it("uses the sealed Mega38 boundary version", () => {
    expect(CONSTITUTIONAL_RATIFICATION_BOUNDARY_VERSION).toBe("mega38-v1");
  });

  it("authorizes a fully reviewed constitutional amendment", () => {
    const result = evaluateConstitutionalRatification(validInput());

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("authorized");
  });

  it("rejects unauthenticated ratification", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ authenticated: false }),
      ).reason,
    ).toBe("authentication_required");
  });

  it("rejects authority without explicit delegation", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ explicitlyDelegated: false }),
      ).reason,
    ).toBe("explicit_delegation_required");
  });

  it("requires the current constitution version", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ currentVersion: " " }),
      ).reason,
    ).toBe("current_version_required");
  });

  it("requires a proposed constitution version", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ proposedVersion: "" }),
      ).reason,
    ).toBe("proposed_version_required");
  });

  it("blocks same-version mutation", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({
          currentVersion: "constitution-v2",
          proposedVersion: "constitution-v2",
        }),
      ).reason,
    ).toBe("version_change_required");
  });

  it("requires an amendment reason", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ reason: "" }),
      ).reason,
    ).toBe("reason_required");
  });

  it("requires a sealed SHA-256 amendment digest", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ amendmentDigest: "invalid" }),
      ).reason,
    ).toBe("amendment_digest_required");
  });

  it("requires the previous-version digest", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ previousVersionDigest: "invalid" }),
      ).reason,
    ).toBe("previous_version_digest_required");
  });

  it("requires completed rights-impact review", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ rightsImpactReviewCompleted: false }),
      ).reason,
    ).toBe("rights_impact_review_required");
  });

  it("requires affirmative rights-impact approval", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ rightsImpactReviewApproved: false }),
      ).reason,
    ).toBe("rights_impact_approval_required");
  });

  it("requires independent review", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ independentReviewCompleted: false }),
      ).reason,
    ).toBe("independent_review_required");
  });

  it("requires conflict disclosure", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ conflictsDisclosed: false }),
      ).reason,
    ).toBe("conflict_disclosure_required");
  });

  it("requires recusal when a reviewer conflict exists", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({
          reviewerConflictPresent: true,
          recusalCompletedWhenRequired: false,
        }),
      ).reason,
    ).toBe("recusal_required");
  });

  it("requires the review window to complete", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ reviewWindowCompleted: false }),
      ).reason,
    ).toBe("review_window_required");
  });

  it("requires the configured approval threshold", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ approvalThresholdMet: false }),
      ).reason,
    ).toBe("approval_threshold_required");
  });

  it("requires a public change record", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ publicChangeRecordPrepared: false }),
      ).reason,
    ).toBe("public_change_record_required");
  });

  it("requires preservation of the previous version", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ previousVersionPreserved: false }),
      ).reason,
    ).toBe("previous_version_preservation_required");
  });

  it("requires a valid effective date", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ effectiveDate: "not-a-date" }),
      ).reason,
    ).toBe("effective_date_required");
  });

  it("blocks sole ratification by the affected power holder", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ affectedPowerHolderSoleApproval: true }),
      ).reason,
    ).toBe("affected_power_holder_sole_ratification_blocked");
  });

  it("blocks fundamental-rights reduction", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ fundamentalRightsReduction: true }),
      ).reason,
    ).toBe("fundamental_rights_reduction_blocked");
  });

  it("blocks emergency bypass of ratification safeguards", () => {
    expect(
      evaluateConstitutionalRatification(
        validInput({ emergencyBypassRequested: true }),
      ).reason,
    ).toBe("emergency_bypass_blocked");
  });

  it("exposes fail-closed constitutional invariants", () => {
    const result = evaluateConstitutionalRatification(validInput());

    expect(result.authenticationRequired).toBe(true);
    expect(result.explicitDelegationRequired).toBe(true);
    expect(result.versionChangeRequired).toBe(true);
    expect(result.rightsImpactReviewRequired).toBe(true);
    expect(result.independentReviewRequired).toBe(true);
    expect(result.approvalThresholdRequired).toBe(true);
    expect(result.publicChangeRecordRequired).toBe(true);
    expect(result.previousVersionPreservationRequired).toBe(true);
    expect(result.affectedPowerHolderCannotUnilaterallyRatify).toBe(true);
    expect(result.fundamentalRightsReductionAllowed).toBe(false);
    expect(result.emergencyBypassAllowed).toBe(false);
    expect(result.silentRatificationAllowed).toBe(false);
  });

  it("uses canonical server-side admin authentication in the route", () => {
    const routePath = path.join(
      process.cwd(),
      "app/api/governance/constitutional-ratification-boundary/route.ts",
    );

    const source = fs.readFileSync(routePath, "utf8");

    expect(source).toContain(
      'from "@/src/lib/auth/requireAdminSession"',
    );
    expect(source).toContain("await requireAdminSession()");
    expect(source).toContain("authenticated: true");
    expect(source).toContain("explicitlyDelegated: true");
  });

  it("does not permit the client contract to supply consequential authority", () => {
    const routePath = path.join(
      process.cwd(),
      "app/api/governance/constitutional-ratification-boundary/route.ts",
    );

    const source = fs.readFileSync(routePath, "utf8");

    expect(source).toContain(
      '"authenticated" | "explicitlyDelegated"',
    );
    expect(source).toContain(
      "Omit<",
    );
  });
});
