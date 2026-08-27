import { describe, expect, it } from "vitest";

import {
  assertGovernanceEconomyFirewall,
  evaluateGovernanceAuthority,
  GOVERNANCE_ECONOMY_FIREWALL_VERSION,
} from "../../src/core/governance/economyAuthorityFirewall";

describe("Mega31 governance-economy firewall", () => {
  it("has an explicit versioned contract", () => {
    expect(GOVERNANCE_ECONOMY_FIREWALL_VERSION).toBe("mega31-v1");
  });

  it("does not grant governance authority from extreme wealth", () => {
    const result = evaluateGovernanceAuthority({
      zencoinBalance: Number.MAX_SAFE_INTEGER,
      walletBalance: Number.MAX_SAFE_INTEGER,
      revenue: Number.MAX_SAFE_INTEGER,
    });

    expect(result.allowed).toBe(false);
    expect(result.basis).toBe("no_governance_authority");
  });

  it("does not grant governance authority from popularity", () => {
    const result = evaluateGovernanceAuthority({
      followerCount: Number.MAX_SAFE_INTEGER,
      engagementScore: Number.MAX_SAFE_INTEGER,
    });

    expect(result.allowed).toBe(false);
    expect(result.popularityCannotCreateAuthority).toBe(true);
  });

  it("does not grant authority from token holdings", () => {
    const result = evaluateGovernanceAuthority({
      zencoinBalance: Number.MAX_SAFE_INTEGER,
    });

    expect(result.allowed).toBe(false);
    expect(result.tokenHoldingsCannotCreateAuthority).toBe(true);
  });

  it("allows explicitly delegated governance authority", () => {
    const result = evaluateGovernanceAuthority({
      delegatedGovernanceAuthority: true,
    });

    expect(result.allowed).toBe(true);
    expect(result.basis).toBe("delegated_governance_authority");
  });

  it("allows canonical admin authority", () => {
    const result = evaluateGovernanceAuthority({
      role: "admin",
      isAdmin: true,
    });

    expect(result.allowed).toBe(true);
    expect(result.basis).toBe("admin_authority");
  });

  it("always marks economic signals as ignored for authority", () => {
    const result = evaluateGovernanceAuthority({
      revenue: 999999999,
      commercialStatus: "highest_tier",
    });

    expect(result.economySignalsIgnored).toBe(true);
    expect(result.authorityCannotBePurchased).toBe(true);
  });

  it("passes the built-in constitutional firewall assertion", () => {
    expect(assertGovernanceEconomyFirewall()).toBe(true);
  });
});
