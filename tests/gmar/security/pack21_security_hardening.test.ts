import { describe, expect, it } from "vitest";
import { securityRuntimeHealthy } from "../../../src/core/gmar/security/runtime";
import { economySecurityHealthy } from "../../../src/core/gmar/security/economyGuard";

describe("GMAR Mega Pack 21 — Security Hardening", () => {
  it("validates security runtime", () => {
    const security = securityRuntimeHealthy();

    expect(security.abuseProtected).toBe(true);
    expect(security.safeDefaults).toBe(true);
  });

  it("validates economy security", () => {
    const economy = economySecurityHealthy();

    expect(economy.fraudGuard).toBe(true);
    expect(economy.powerPurchaseBlocked).toBe(true);
  });
});
