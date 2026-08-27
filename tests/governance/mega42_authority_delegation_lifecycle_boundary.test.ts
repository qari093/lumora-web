import fs from "node:fs";
import { describe, expect, it } from "vitest";

import {
  AUTHORITY_DELEGATION_LIFECYCLE_BOUNDARY_VERSION,
  evaluateAuthorityDelegationLifecycle,
  type AuthorityDelegationLifecycleInput,
} from "@/src/core/governance/authorityDelegationLifecycleBoundary";

function validInput(
  overrides: Partial<AuthorityDelegationLifecycleInput> = {},
): AuthorityDelegationLifecycleInput {
  return {
    reviewerAuthenticated: true,
    delegationId: "delegation-001",
    delegatedBy: "platform-governance-authority",
    delegatedTo: "authorized-governance-reviewer",
    purpose: "Review a narrowly scoped governance decision.",
    scope: ["governance.review", "governance.explain"],
    issuedAt: "2026-08-19T18:00:00.000Z",
    startsAt: "2026-08-19T18:05:00.000Z",
    expiresAt: "2026-08-20T18:05:00.000Z",
    decisionAt: "2026-08-19T20:00:00.000Z",
    revokedAt: null,
    revocationReason: null,
    auditReference: "audit://governance/delegation/001",
    publicAccountabilityReference: "/api/governance/public-notice",
    unboundedScope: false,
    automaticRenewal: false,
    permanentDelegation: false,
    authorityDerivedFromEconomicPower: false,
    authorityDerivedFromPopularity: false,
    authorityDerivedFromFollowerCount: false,
    authorityDerivedFromTokenBalance: false,
    emergencyBypassRequested: false,
    ...overrides,
  };
}

describe("Mega42 authority delegation lifecycle boundary", () => {
  it("uses Mega42 version", () => {
    expect(AUTHORITY_DELEGATION_LIFECYCLE_BOUNDARY_VERSION).toBe("mega42-v1");
  });

  it("accepts a valid active delegation", () => {
    const result = evaluateAuthorityDelegationLifecycle(validInput());
    expect(result.allowed).toBe(true);
    expect(result.active).toBe(true);
    expect(result.reason).toBe("active_delegation");
  });

  it("requires authenticated reviewer", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ reviewerAuthenticated: false }),
      ).reason,
    ).toBe("reviewer_authentication_required");
  });

  it("requires explicit scope", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(validInput({ scope: [] })).reason,
    ).toBe("scope_required");
  });

  it("blocks unbounded scope", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ unboundedScope: true }),
      ).reason,
    ).toBe("unbounded_scope_forbidden");
  });

  it("blocks automatic renewal", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ automaticRenewal: true }),
      ).reason,
    ).toBe("automatic_renewal_forbidden");
  });

  it("blocks permanent delegation", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ permanentDelegation: true }),
      ).reason,
    ).toBe("permanent_delegation_forbidden");
  });

  it("blocks use before activation", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ decisionAt: "2026-08-19T18:01:00.000Z" }),
      ).reason,
    ).toBe("delegation_not_started");
  });

  it("blocks use after expiry", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ decisionAt: "2026-08-20T18:05:00.000Z" }),
      ).reason,
    ).toBe("delegation_expired");
  });

  it("blocks revoked delegation", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({
          revokedAt: "2026-08-19T19:00:00.000Z",
          revocationReason: "Delegation withdrawn.",
        }),
      ).reason,
    ).toBe("delegation_revoked");
  });

  it("requires revocation reason", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({
          revokedAt: "2026-08-19T19:00:00.000Z",
          revocationReason: "",
        }),
      ).reason,
    ).toBe("revocation_reason_required");
  });

  it("blocks authority from economic power", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ authorityDerivedFromEconomicPower: true }),
      ).reason,
    ).toBe("economic_influence_forbidden");
  });

  it("blocks authority from popularity", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ authorityDerivedFromPopularity: true }),
      ).reason,
    ).toBe("popularity_influence_forbidden");
  });

  it("blocks authority from follower count", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ authorityDerivedFromFollowerCount: true }),
      ).reason,
    ).toBe("follower_influence_forbidden");
  });

  it("blocks authority from token balance", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ authorityDerivedFromTokenBalance: true }),
      ).reason,
    ).toBe("token_influence_forbidden");
  });

  it("blocks emergency bypass", () => {
    expect(
      evaluateAuthorityDelegationLifecycle(
        validInput({ emergencyBypassRequested: true }),
      ).reason,
    ).toBe("emergency_bypass_forbidden");
  });

  it("returns fixed lifecycle safeguards", () => {
    const result = evaluateAuthorityDelegationLifecycle(validInput());

    expect(result.explicitScopeRequired).toBe(true);
    expect(result.finiteDurationRequired).toBe(true);
    expect(result.revocationSupported).toBe(true);
    expect(result.auditabilityRequired).toBe(true);
    expect(result.automaticRenewalAllowed).toBe(false);
    expect(result.permanentDelegationAllowed).toBe(false);
    expect(result.unboundedDelegationAllowed).toBe(false);
  });

  it("is validation only", () => {
    const result = evaluateAuthorityDelegationLifecycle(validInput());

    expect(result.lifecycleValidationOnly).toBe(true);
    expect(result.createsDelegation).toBe(false);
    expect(result.revokesDelegation).toBe(false);
    expect(result.mutatesAuthority).toBe(false);
  });

  it("server derives reviewer authentication", () => {
    const route = fs.readFileSync(
      "app/api/governance/delegation-lifecycle-boundary/route.ts",
      "utf8",
    );

    expect(route).toContain("requireAdminSession");
    expect(route).toContain('"reviewerAuthenticated"');
    expect(route).toContain("reviewerAuthenticated: true");
    expect(route).not.toContain("body.reviewerAuthenticated");
  });

  it("does not introduce database mutation", () => {
    const route = fs.readFileSync(
      "app/api/governance/delegation-lifecycle-boundary/route.ts",
      "utf8",
    );

    expect(route).not.toContain("@prisma");
    expect(route).not.toContain("prisma.");
    expect(route).not.toContain("DATABASE_URL");
  });
});
