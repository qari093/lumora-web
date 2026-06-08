import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta onboarding final seal", () => {
  it("writes onboarding final seal artifacts", () => {
    expect(fs.existsSync("data/private-beta/onboarding-final-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-onboarding-final-seal.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-onboarding-final-seal.md")).toBe(true);
  });

  it("seals onboarding while keeping beta controlled", () => {
    const seal = JSON.parse(fs.readFileSync("data/private-beta/onboarding-final-seal.json", "utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_ONBOARDING_SEALED");
    expect(seal.checks.inviteDispatchAudit).toBe("PASS");
    expect(seal.checks.onboardingSmoke).toBe("PASS");
    expect(seal.guards.allowlistOnly).toBe(true);
    expect(seal.guards.publicSignupDisabled).toBe(true);
    expect(seal.guards.paymentLiveMode).toBe(false);
    expect(seal.guards.manualExpansionOnly).toBe(true);
    expect(seal.nextCanonicalPhase).toBe("Private beta wave 1 active observation seal");
  });
});
