import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  GOVERNANCE_DECISION_PUBLICATION_VERSION,
  evaluateGovernanceDecisionPublication,
} from "../../src/core/governance/governanceDecisionPublication";

const root = process.cwd();

function read(relative: string) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function validInput(overrides: Record<string, unknown> = {}) {
  return {
    decisionId: "decision-001",
    decisionType: "constitutional_publication",
    decisionSummary: "A public governance decision.",
    decisionReason: "Transparency and accountability.",
    decisionDate: "2026-08-19",
    effectiveDate: "2026-08-19",
    authorityBasis: "documented governance authority",
    reviewPath: "independent review",
    remedyPath: "appeal or remedy",
    rightsImpactStatus: "reviewed",
    conflictReviewStatus: "no unresolved conflict",
    publicAccountabilityRecord: "/api/governance/decision-publication",
    ...overrides,
  };
}

describe("Mega Step 40 — governance decision record publication", () => {
  it("exposes the expected boundary version", () => {
    expect(GOVERNANCE_DECISION_PUBLICATION_VERSION).toBe("mega40-v1");
  });

  it("allows a complete public governance record", () => {
    const result = evaluateGovernanceDecisionPublication(validInput());
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("published");
    expect(result.deterministicDigest).toMatch(/^[a-f0-9]{64}$/);
  });

  it.each([
    ["decisionId", "decision_id_required"],
    ["decisionType", "decision_type_required"],
    ["decisionSummary", "decision_summary_required"],
    ["decisionReason", "decision_reason_required"],
    ["decisionDate", "decision_date_required"],
    ["effectiveDate", "effective_date_required"],
    ["authorityBasis", "authority_basis_required"],
    ["reviewPath", "review_path_required"],
    ["remedyPath", "remedy_path_required"],
    ["rightsImpactStatus", "rights_impact_status_required"],
    ["conflictReviewStatus", "conflict_review_status_required"],
    ["publicAccountabilityRecord", "public_accountability_record_required"],
  ])("fails closed when %s is absent", (field, reason) => {
    const result = evaluateGovernanceDecisionPublication(
      validInput({ [field]: "" }),
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe(reason);
  });

  it("blocks secret-bearing metadata from public publication", () => {
    const result = evaluateGovernanceDecisionPublication(
      validInput({
        metadata: {
          api_key: "must-not-publish",
        },
      }),
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe(
      "secret_or_internal_only_metadata_detected",
    );
  });

  it("requires accountability safeguards in every result", () => {
    const result = evaluateGovernanceDecisionPublication(validInput());

    expect(result.publicationRequired).toBe(true);
    expect(result.explanationRequired).toBe(true);
    expect(result.reviewPathRequired).toBe(true);
    expect(result.remedyPathRequired).toBe(true);
    expect(result.rightsImpactVisibilityRequired).toBe(true);
    expect(result.conflictReviewVisibilityRequired).toBe(true);
    expect(result.authorityBasisVisibilityRequired).toBe(true);
    expect(result.secretInternalMetadataPublicationAllowed).toBe(false);
    expect(result.hiddenConsequentialDecisionAllowed).toBe(false);
  });

  it("uses deterministic publication digests", () => {
    const first = evaluateGovernanceDecisionPublication(validInput());
    const second = evaluateGovernanceDecisionPublication(validInput());

    expect(first.deterministicDigest).toBe(second.deterministicDigest);
  });

  it("provides a public GET-only API surface", () => {
    const route = read(
      "app/api/governance/decision-publication/route.ts",
    );

    expect(route).toContain("export async function GET");
    expect(route).not.toMatch(
      /export async function (POST|PUT|PATCH|DELETE)/,
    );
  });

  it("does not require authentication for the public read surface", () => {
    const route = read(
      "app/api/governance/decision-publication/route.ts",
    );

    expect(route).not.toContain("requireAdminSession");
    expect(route).not.toContain("requireUserSession");
    expect(route).not.toContain("getServerSession");
  });

  it("does not claim a durable governance database archive", () => {
    const route = read(
      "app/api/governance/decision-publication/route.ts",
    );

    expect(route).toContain("durableDatabaseArchiveClaimed: false");
    expect(route).not.toContain("prisma.");
  });

  it("keeps public constitution publication reachable", () => {
    expect(
      fs.existsSync(
        path.join(
          root,
          "app/api/governance/constitution-publication/route.ts",
        ),
      ),
    ).toBe(true);
  });

  it("keeps constitutional ratification reachable", () => {
    expect(
      fs.existsSync(
        path.join(
          root,
          "app/api/governance/constitutional-ratification-boundary/route.ts",
        ),
      ),
    ).toBe(true);
  });

  it("keeps rights-impact review reachable", () => {
    expect(
      fs.existsSync(
        path.join(
          root,
          "app/api/governance/rights-impact-review-boundary/route.ts",
        ),
      ),
    ).toBe(true);
  });

  it("does not frame Lumora as a government or state", () => {
    const route = read(
      "app/api/governance/decision-publication/route.ts",
    ).toLowerCase();

    expect(route).not.toContain("sovereign state");
    expect(route).not.toContain("national government");
    expect(route).not.toContain("legal citizenship");
  });
});
