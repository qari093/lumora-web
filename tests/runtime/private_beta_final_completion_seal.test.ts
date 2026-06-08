import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta final completion seal", () => {
  it("writes final completion artifacts", () => {
    expect(fs.existsSync("data/private-beta/final-completion-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-final-completion-seal.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-final-completion-seal.md")).toBe(true);
  });

  it("seals the private beta execution chain", () => {
    const seal = JSON.parse(fs.readFileSync("data/private-beta/final-completion-seal.json", "utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_EXECUTION_CHAIN_COMPLETE");
    expect(seal.completedThroughStep).toBe(30);
    expect(Object.values(seal.checks).every((v) => v === "PASS")).toBe(true);
    expect(seal.guards.allowlistOnly).toBe(true);
    expect(seal.guards.publicSignupDisabled).toBe(true);
    expect(seal.guards.paymentLiveMode).toBe(false);
    expect(seal.guards.manualExpansionOnly).toBe(true);
    expect(seal.guards.waveOneMaxInvites).toBeLessThanOrEqual(25);
    expect(seal.nextCanonicalPhase).toBe("Hold Wave 1 and observe real users");
  });
});
