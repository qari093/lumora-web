import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  RIGHTS_IMPACT_REVIEW_BOUNDARY_VERSION,
  evaluateRightsImpactReview,
  type RightsImpactReviewInput,
} from "../../src/core/governance/rightsImpactReviewBoundary";

function validInput(
  overrides: Partial<RightsImpactReviewInput> = {},
): RightsImpactReviewInput {
  return {
    authenticated: true,
    explicitlyDelegated: true,

    actionDescription: "Apply a narrowly scoped temporary safety restriction.",
    legitimateAim: "Prevent a documented and concrete safety harm.",

    affectedRights: ["expression", "participation"],
    severity: "high",

    evidenceSummary: "Documented evidence supports the identified risk.",

    necessityEstablished: true,
    lessRestrictiveAlternativeAvailable: false,
    proportionalityEstablished: true,

    reducesFundamentalRights: false,

    safeguards: [
      "human review",
      "limited scope",
      "written reason",
      "appeal",
    ],
    humanReviewAvailable: true,
    appealOrRemedyAvailable: true,

    temporaryRestriction: true,
    timeLimit: "24 hours",
    reviewDate: "2026-08-20",

    transparencyRecordPlanned: true,

    reviewerConflictPresent: false,
    reviewerRecusedWhenRequired: false,
    independentReviewAvailable: true,

    ...overrides,
  };
}

describe("Mega Step 37 — rights impact review boundary", () => {
  it("exposes the canonical Mega37 boundary version", () => {
    expect(RIGHTS_IMPACT_REVIEW_BOUNDARY_VERSION).toBe("mega37-v1");
  });

  it("fails closed without authentication", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ authenticated: false }),
      ).reason,
    ).toBe("unauthenticated");
  });

  it("fails closed without explicit delegation", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ explicitlyDelegated: false }),
      ).reason,
    ).toBe("explicit_delegation_required");
  });

  it("requires a legitimate aim", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ legitimateAim: "" }),
      ).reason,
    ).toBe("legitimate_aim_required");
  });

  it("requires identified affected rights", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ affectedRights: [] }),
      ).reason,
    ).toBe("affected_rights_required");
  });

  it("requires evidence", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ evidenceSummary: "" }),
      ).reason,
    ).toBe("evidence_required");
  });

  it("requires necessity", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ necessityEstablished: false }),
      ).reason,
    ).toBe("necessity_not_established");
  });

  it("blocks action when a less restrictive alternative exists", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ lessRestrictiveAlternativeAvailable: true }),
      ).reason,
    ).toBe("less_restrictive_alternative_available");
  });

  it("requires proportionality", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ proportionalityEstablished: false }),
      ).reason,
    ).toBe("proportionality_not_established");
  });

  it("blocks fundamental-rights reduction", () => {
    const result = evaluateRightsImpactReview(
      validInput({ reducesFundamentalRights: true }),
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("fundamental_rights_reduction_blocked");
    expect(result.fundamentalRightsReductionAllowed).toBe(false);
  });

  it("requires safeguards for consequential impact", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ safeguards: [] }),
      ).reason,
    ).toBe("safeguards_required");
  });

  it("requires human review for consequential impact", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ humanReviewAvailable: false }),
      ).reason,
    ).toBe("human_review_required");
  });

  it("requires appeal or remedy for consequential impact", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ appealOrRemedyAvailable: false }),
      ).reason,
    ).toBe("appeal_or_remedy_required");
  });

  it("requires a time limit for temporary restrictions", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ timeLimit: null }),
      ).reason,
    ).toBe("time_limit_required");
  });

  it("requires a review date for consequential impact", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ reviewDate: null }),
      ).reason,
    ).toBe("review_date_required");
  });

  it("requires a transparency record", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({ transparencyRecordPlanned: false }),
      ).reason,
    ).toBe("transparency_record_required");
  });

  it("requires recusal and independent review where conflict exists", () => {
    expect(
      evaluateRightsImpactReview(
        validInput({
          reviewerConflictPresent: true,
          reviewerRecusedWhenRequired: false,
          independentReviewAvailable: false,
        }),
      ).reason,
    ).toBe("conflict_review_required");
  });

  it("authorizes only when all rights-impact gates pass", () => {
    const result = evaluateRightsImpactReview(validInput());

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("authorized");
    expect(result.necessityRequired).toBe(true);
    expect(result.proportionalityRequired).toBe(true);
    expect(result.leastRestrictiveMeansRequired).toBe(true);
    expect(result.silentRightsRestrictionAllowed).toBe(false);
    expect(result.indefiniteRestrictionAllowed).toBe(false);
    expect(result.automatedFinalApprovalAllowed).toBe(false);
  });

  it("uses canonical server-side admin authentication in the route", () => {
    const route = fs.readFileSync(
      path.join(
        process.cwd(),
        "app/api/governance/rights-impact-review-boundary/route.ts",
      ),
      "utf8",
    );

    expect(route).toContain(
      'from "@/src/lib/auth/requireAdminSession"',
    );
    expect(route).toContain("requireAdminSession()");
    expect(route).not.toContain(
      'from "@/src/lib/auth/requireUserSession"',
    );
  });

  it("does not accept caller authentication or delegation as authority", () => {
    const route = fs.readFileSync(
      path.join(
        process.cwd(),
        "app/api/governance/rights-impact-review-boundary/route.ts",
      ),
      "utf8",
    );

    expect(route).toContain(
      '"authenticated" | "explicitlyDelegated"',
    );
    expect(route).toContain("authenticated: true");
    expect(route).toContain("explicitlyDelegated: true");
  });
});
