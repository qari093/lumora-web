import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta launch readiness final seal", () => {
  it("writes final launch readiness artifacts", () => {
    expect(fs.existsSync("data/private-beta/launch-readiness-final-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-launch-readiness-final-seal.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-launch-readiness-final-seal.md")).toBe(true);
  });

  it("seals private beta launch readiness", () => {
    const seal = JSON.parse(fs.readFileSync("data/private-beta/launch-readiness-final-seal.json", "utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_LAUNCH_READINESS_FINAL_SEALED");
    expect(Object.values(seal.checks).every((v) => v === "PASS")).toBe(true);
    expect(seal.guards.allowlistOnly).toBe(true);
    expect(seal.guards.publicSignupDisabled).toBe(true);
    expect(seal.guards.paymentLiveMode).toBe(false);
    expect(seal.guards.manualExpansionOnly).toBe(true);
    expect(seal.guards.waveOneMaxInvites).toBeLessThanOrEqual(25);
    expect(seal.nextCanonicalPhase).toBe("Private beta wave 1 live");
  });
});
