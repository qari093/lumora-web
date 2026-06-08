import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta wave 1 active observation seal", () => {
  it("writes active observation seal artifacts", () => {
    expect(fs.existsSync("data/private-beta/wave-1-active-observation-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-wave-1-active-observation-seal.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-wave-1-active-observation-seal.md")).toBe(true);
  });

  it("seals wave 1 active observation conservatively", () => {
    const seal = JSON.parse(fs.readFileSync("data/private-beta/wave-1-active-observation-seal.json", "utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_WAVE_1_ACTIVE_OBSERVATION_SEALED");
    expect(seal.wave).toBe(1);
    expect(seal.checks.onboardingFinalSeal).toBe("PASS");
    expect(seal.checks.monitoringSeal).toBe("PASS");
    expect(seal.checks.stabilitySeal).toBe("PASS");
    expect(seal.guards.allowlistOnly).toBe(true);
    expect(seal.guards.publicSignupDisabled).toBe(true);
    expect(seal.guards.paymentLiveMode).toBe(false);
    expect(seal.guards.manualExpansionOnly).toBe(true);
    expect(seal.nextCanonicalPhase).toBe("Private beta launch readiness final seal");
  });
});
