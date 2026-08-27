import fs from "node:fs";
import path from "node:path";
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION,
  REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT,
  evaluateRemedyEnforcementFollowthrough,
  type RemedyEnforcementFollowthroughInput,
} from "../../src/core/governance/remedyEnforcementFollowthroughBoundary";

const root = process.cwd();

function validInput(
  patch: Partial<RemedyEnforcementFollowthroughInput> = {},
): RemedyEnforcementFollowthroughInput {
  return {
    originalDecisionReference: "moderation-decision:example",
    appealOrRemedyReference: "moderation-appeal:example",
    grantedRelief: "Restore the affected content.",
    authorizedRemedyOwner: "authenticated-admin",
    humanReviewCompleted: true,

    remedyState: "completed",
    remedyScope: "Only the affected moderation decision.",
    correctiveAction: "Restore content and remove the rejected restriction.",
    auditReference: "audit:mega45-example",
    idempotencyKey: "remedy:mega45-example",

    duplicateEffectuationAttempt: false,
    exceedsGrantedRelief: false,
    grantedReliefLeftUnenforced: false,

    failedEffectuationVisible: true,
    partialEffectuationVisible: true,
    escalationReference: null,

    restorationRequired: true,
    restorationState: "restored",

    affectedSubjectReference: "subject:example",

    privacyBoundaryConfirmed: true,
    exposesSecuritySensitiveEvidence: false,
    createsSecretRightsRestriction: false,

    wealthSetsAuthority: false,
    popularitySetsAuthority: false,
    followerCountSetsAuthority: false,
    tokenBalanceSetsAuthority: false,

    createsGovernmentalAuthority: false,
    claimsLegalCitizenship: false,
    claimsStatehood: false,
    claimsIndependentJurisdiction: false,

    effectuationSafe: true,

    ...patch,
  };
}

describe(
  "Mega Step 45 — remedy enforcement follow-through and effective relief boundary",
  () => {
    it("uses the mega45 contract version", () => {
      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION,
      ).toBe("mega45-v1");
    });

    it("authorizes complete bounded remedy follow-through", () => {
      const result =
        evaluateRemedyEnforcementFollowthrough(validInput());

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("authorized");
      expect(result.effectiveReliefRequired).toBe(true);
      expect(result.paperOnlyRemedyAllowed).toBe(false);
    });

    const requiredCases: Array<
      [
        Partial<RemedyEnforcementFollowthroughInput>,
        string,
      ]
    > = [
      [
        { originalDecisionReference: "" },
        "original_decision_reference_required",
      ],
      [
        { appealOrRemedyReference: "" },
        "appeal_or_remedy_reference_required",
      ],
      [
        { grantedRelief: "" },
        "granted_relief_required",
      ],
      [
        { authorizedRemedyOwner: "" },
        "authorized_remedy_owner_required",
      ],
      [
        { humanReviewCompleted: false },
        "human_review_required",
      ],
      [
        { remedyState: "" as never },
        "remedy_state_required",
      ],
      [
        { remedyScope: "" },
        "remedy_scope_required",
      ],
      [
        { correctiveAction: "" },
        "corrective_action_required",
      ],
      [
        { auditReference: "" },
        "audit_reference_required",
      ],
      [
        { idempotencyKey: "" },
        "idempotency_key_required",
      ],
      [
        { duplicateEffectuationAttempt: true },
        "duplicate_effectuation_blocked",
      ],
      [
        { exceedsGrantedRelief: true },
        "remedy_scope_exceeded",
      ],
      [
        { grantedReliefLeftUnenforced: true },
        "silent_non_enforcement_blocked",
      ],
      [
        {
          remedyState: "failed",
          failedEffectuationVisible: false,
          escalationReference: "escalation:1",
        },
        "failed_effectuation_visibility_required",
      ],
      [
        {
          remedyState: "partially_applied",
          partialEffectuationVisible: false,
          escalationReference: "escalation:1",
        },
        "partial_effectuation_visibility_required",
      ],
      [
        {
          remedyState: "failed",
          failedEffectuationVisible: true,
          escalationReference: "",
        },
        "escalation_required",
      ],
      [
        {
          restorationRequired: true,
          restorationState: "",
        },
        "restoration_state_required",
      ],
      [
        { affectedSubjectReference: "" },
        "affected_subject_reference_required",
      ],
      [
        { privacyBoundaryConfirmed: false },
        "privacy_boundary_required",
      ],
      [
        { exposesSecuritySensitiveEvidence: true },
        "security_sensitive_evidence_exposure_blocked",
      ],
      [
        { createsSecretRightsRestriction: true },
        "secret_rights_restriction_blocked",
      ],
      [
        { wealthSetsAuthority: true },
        "wealth_authority_blocked",
      ],
      [
        { popularitySetsAuthority: true },
        "popularity_authority_blocked",
      ],
      [
        { followerCountSetsAuthority: true },
        "follower_authority_blocked",
      ],
      [
        { tokenBalanceSetsAuthority: true },
        "token_authority_blocked",
      ],
      [
        { createsGovernmentalAuthority: true },
        "governmental_authority_creation_blocked",
      ],
      [
        { claimsLegalCitizenship: true },
        "legal_citizenship_claim_blocked",
      ],
      [
        { claimsStatehood: true },
        "statehood_claim_blocked",
      ],
      [
        { claimsIndependentJurisdiction: true },
        "independent_jurisdiction_claim_blocked",
      ],
      [
        { effectuationSafe: false },
        "unsafe_effectuation_blocked",
      ],
    ];

    it.each(requiredCases)(
      "fails closed for %j",
      (patch, reason) => {
        const result =
          evaluateRemedyEnforcementFollowthrough(
            validInput(patch),
          );

        expect(result.allowed).toBe(false);
        expect(result.reason).toBe(reason);
      },
    );

    it("requires explicit failed repair visibility and escalation", () => {
      const result =
        evaluateRemedyEnforcementFollowthrough(
          validInput({
            remedyState: "failed",
            failedEffectuationVisible: true,
            escalationReference: "escalation:repair-owner",
          }),
        );

      expect(result.allowed).toBe(true);
      expect(
        result.failedEffectuationMustRemainVisible,
      ).toBe(true);
      expect(
        result.escalationRequiredWhenRepairCannotComplete,
      ).toBe(true);
    });

    it("requires explicit partial repair visibility and escalation", () => {
      const result =
        evaluateRemedyEnforcementFollowthrough(
          validInput({
            remedyState: "partially_applied",
            partialEffectuationVisible: true,
            escalationReference: "escalation:partial",
          }),
        );

      expect(result.allowed).toBe(true);
    });

    it("prevents remedy scope from exceeding granted relief", () => {
      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT
          .remedyCannotExceedGrantedRelief,
      ).toBe(true);
    });

    it("requires idempotency and blocks duplicate effectuation", () => {
      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT
          .idempotencyRequired,
      ).toBe(true);

      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT
          .duplicateEffectuationAllowed,
      ).toBe(false);
    });

    it("does not derive remedy authority from wealth, popularity, followers, or tokens", () => {
      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT
          .wealthPopularityFollowersAndTokensDoNotCreateRemedyAuthority,
      ).toBe(true);
    });

    it("does not create governmental status or legal citizenship", () => {
      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT
          .governmentalAuthorityCreated,
      ).toBe(false);

      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT
          .legalCitizenshipCreated,
      ).toBe(false);

      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT
          .statehoodCreated,
      ).toBe(false);

      expect(
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT
          .independentJurisdictionCreated,
      ).toBe(false);
    });

    it("preserves existing durable moderation appeal infrastructure", () => {
      const service = fs.readFileSync(
        path.join(
          root,
          "src/core/moderation-production/appeal.ts",
        ),
        "utf8",
      );

      const route = fs.readFileSync(
        path.join(
          root,
          "app/api/moderation/appeal/route.ts",
        ),
        "utf8",
      );

      expect(service).toContain(
        "prisma.moderationAppeal.create",
      );

      expect(service).toContain(
        "reviewModerationAppeal",
      );

      expect(route).toContain(
        "requireUserSession",
      );
    });

    it("keeps the new governance boundary POST-only and admin-session bound", () => {
      const route = fs.readFileSync(
        path.join(
          root,
          "app/api/governance/remedy-enforcement-followthrough-boundary/route.ts",
        ),
        "utf8",
      );

      expect(route).toContain(
        "export async function POST",
      );

      expect(route).not.toContain(
        "export async function GET",
      );

      expect(route).toContain(
        "requireAdminSession()",
      );

      expect(route).toContain(
        'source: "authenticated_admin_session"',
      );

      expect(route).toContain(
        "callerSuppliedAuthenticationAccepted: false",
      );
    });

    it("adds no new database dependency to the governance boundary", () => {
      const source = [
        "src/core/governance/remedyEnforcementFollowthroughBoundary.ts",
        "app/api/governance/remedy-enforcement-followthrough-boundary/route.ts",
      ]
        .map((file) =>
          fs.readFileSync(
            path.join(root, file),
            "utf8",
          ),
        )
        .join("\n");

      expect(source).not.toContain("prisma.");
      expect(source).not.toContain("@/lib/db");
      expect(source).not.toContain("@/lib/prisma");
    });

    it("preserves constitutional remedy and appeal continuity", () => {
      const constitution = fs.readFileSync(
        path.join(
          root,
          "src/core/governance/constitution.ts",
        ),
        "utf8",
      );

      expect(constitution).toContain(
        '"remedy_and_appeal"',
      );

      expect(constitution).toContain(
        "remedyMustRemainAvailableForConsequentialDecisions",
      );
    });
  },
);
