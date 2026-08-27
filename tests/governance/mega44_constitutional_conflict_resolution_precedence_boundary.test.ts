import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION,
  CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT,
  evaluateConstitutionalConflictResolution,
  type ConstitutionalConflictResolutionInput,
} from "../../src/core/governance/constitutionalConflictResolutionBoundary";

const root = process.cwd();

function validInput(
  patch: Partial<ConstitutionalConflictResolutionInput> = {},
): ConstitutionalConflictResolutionInput {
  return {
    conflictDescription:
      "A jurisdictional overlay and a platform governance rule conflict.",
    leftRuleSource: "jurisdictional_overlay",
    rightRuleSource: "constitutional_core",
    applicableLawContext:
      "Applicable law has been identified and cannot be ignored.",
    ruleScope: "Affected users in the named jurisdiction only.",
    rightsImpactReviewCompleted: true,
    unresolvedApplicableLawConflict: false,
    reducesFundamentalRights: false,
    reducesDueProcess: false,
    reducesPrivacyBaseline: false,
    reducesHumanReview: false,
    reducesRemedyOrAppeal: false,
    reducesAccountability: false,
    emergencyClaimsUnboundedPrecedence: false,
    delegatedAuthorityExceedsParentScope: false,
    economicPowerSetsPrecedence: false,
    popularitySetsPrecedence: false,
    wealthSetsPrecedence: false,
    followerCountSetsPrecedence: false,
    tokenBalanceSetsPrecedence: false,
    secretPrecedenceRule: false,
    createsGovernmentalAuthority: false,
    claimsIndependentJurisdiction: false,
    claimsLegalCitizenship: false,
    claimsStatehood: false,
    overridesCorporateLegalEntity: false,
    conflictSafelyResolvable: true,
    publicAccountabilityReference: "governance://conflict/mega44-example",
    ...patch,
  };
}

describe("Mega Step 44 — constitutional conflict resolution and precedence boundary", () => {
  it("uses the mega44 boundary version", () => {
    expect(CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION).toBe(
      "mega44-v1",
    );
  });

  it("authorizes only a safely resolvable bounded conflict", () => {
    const result = evaluateConstitutionalConflictResolution(validInput());
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("authorized");
  });

  const cases: Array<
    [
      Partial<ConstitutionalConflictResolutionInput>,
      string,
    ]
  > = [
    [{ conflictDescription: "" }, "conflict_description_required"],
    [{ leftRuleSource: "" as never }, "left_rule_source_required"],
    [{ rightRuleSource: "" as never }, "right_rule_source_required"],
    [{ applicableLawContext: "" }, "applicable_law_context_required"],
    [{ ruleScope: "" }, "rule_scope_required"],
    [{ rightsImpactReviewCompleted: false }, "rights_impact_review_required"],
    [
      { unresolvedApplicableLawConflict: true },
      "unresolved_applicable_law_conflict_blocked",
    ],
    [{ reducesFundamentalRights: true }, "fundamental_rights_reduction_blocked"],
    [{ reducesDueProcess: true }, "due_process_reduction_blocked"],
    [{ reducesPrivacyBaseline: true }, "privacy_reduction_blocked"],
    [{ reducesHumanReview: true }, "human_review_reduction_blocked"],
    [{ reducesRemedyOrAppeal: true }, "remedy_or_appeal_reduction_blocked"],
    [{ reducesAccountability: true }, "accountability_reduction_blocked"],
    [
      { emergencyClaimsUnboundedPrecedence: true },
      "emergency_unbounded_precedence_blocked",
    ],
    [
      { delegatedAuthorityExceedsParentScope: true },
      "delegated_authority_scope_escalation_blocked",
    ],
    [{ economicPowerSetsPrecedence: true }, "economic_power_precedence_blocked"],
    [{ popularitySetsPrecedence: true }, "popularity_precedence_blocked"],
    [{ wealthSetsPrecedence: true }, "wealth_precedence_blocked"],
    [{ followerCountSetsPrecedence: true }, "follower_count_precedence_blocked"],
    [{ tokenBalanceSetsPrecedence: true }, "token_balance_precedence_blocked"],
    [{ secretPrecedenceRule: true }, "secret_precedence_rule_blocked"],
    [
      { createsGovernmentalAuthority: true },
      "governmental_authority_creation_blocked",
    ],
    [
      { claimsIndependentJurisdiction: true },
      "independent_jurisdiction_claim_blocked",
    ],
    [{ claimsLegalCitizenship: true }, "legal_citizenship_claim_blocked"],
    [{ claimsStatehood: true }, "statehood_claim_blocked"],
    [
      { overridesCorporateLegalEntity: true },
      "corporate_legal_entity_override_blocked",
    ],
    [{ conflictSafelyResolvable: false }, "conflict_cannot_be_safely_resolved"],
    [
      { publicAccountabilityReference: "" },
      "public_accountability_reference_required",
    ],
  ];

  it.each(cases)("fails closed for %j", (patch, reason) => {
    const result = evaluateConstitutionalConflictResolution(validInput(patch));
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe(reason);
  });

  it("preserves the constitutional protection floor in every decision", () => {
    const result = evaluateConstitutionalConflictResolution(validInput());
    expect(result.constitutionalRightsFloorPreserved).toBe(true);
    expect(result.dueProcessBaselinePreserved).toBe(true);
    expect(result.privacyBaselinePreserved).toBe(true);
    expect(result.humanReviewBaselinePreserved).toBe(true);
    expect(result.remedyAndAppealBaselinePreserved).toBe(true);
    expect(result.accountabilityBaselinePreserved).toBe(true);
  });

  it("does not let emergency authority gain unbounded precedence", () => {
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT
        .emergencyAuthorityCannotClaimUnboundedPrecedence,
    ).toBe(true);
  });

  it("does not let delegated authority exceed parent scope", () => {
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT
        .delegatedAuthorityCannotExceedParentScope,
    ).toBe(true);
  });

  it("does not derive precedence from wealth, popularity, followers, or tokens", () => {
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT
        .wealthPopularityFollowersAndTokensDoNotCreatePrecedence,
    ).toBe(true);
  });

  it("fails closed when a conflict cannot be safely resolved", () => {
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT
        .unresolvedUnsafeConflictsFailClosed,
    ).toBe(true);
  });

  it("keeps Lumora subject to applicable law", () => {
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT
        .platformRemainsSubjectToApplicableLaw,
    ).toBe(true);
  });

  it("does not create statehood, citizenship, government, or independent jurisdiction", () => {
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT.governmentalStatusCreated,
    ).toBe(false);
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT.legalCitizenshipCreated,
    ).toBe(false);
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT.statehoodCreated,
    ).toBe(false);
    expect(
      CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT.independentJurisdictionCreated,
    ).toBe(false);
  });

  it("exposes POST only and requires server-derived admin authentication", () => {
    const route = fs.readFileSync(
      path.join(
        root,
        "app/api/governance/constitutional-conflict-resolution-boundary/route.ts",
      ),
      "utf8",
    );

    expect(route).toContain("export async function POST");
    expect(route).not.toContain("export async function GET");
    expect(route).toContain("requireAdminSession()");
    expect(route).toContain('source: "authenticated_admin_session"');
    expect(route).toContain("callerSuppliedAuthenticationAccepted: false");
  });

  it("does not add a database dependency", () => {
    const source = [
      "src/core/governance/constitutionalConflictResolutionBoundary.ts",
      "app/api/governance/constitutional-conflict-resolution-boundary/route.ts",
    ]
      .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
      .join("\n");

    expect(source).not.toContain("prisma.");
    expect(source).not.toContain("@/lib/db");
  });

  it("maintains constitutional continuity", () => {
    const constitution = fs.readFileSync(
      path.join(root, "src/core/governance/constitution.ts"),
      "utf8",
    );

    expect(constitution).toContain("fundamentalRights");
    expect(constitution).toContain('"privacy"');
    expect(constitution).toContain('"human_review"');
    expect(constitution).toContain('"remedy_and_appeal"');
  });

  it("keeps the jurisdictional overlay boundary reachable", () => {
    expect(
      fs.existsSync(
        path.join(
          root,
          "app/api/governance/jurisdictional-compliance-overlay-boundary/route.ts",
        ),
      ),
    ).toBe(true);
  });
});
