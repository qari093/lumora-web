import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta stability seal", () => {
  it("writes stability seal artifacts", () => {
    expect(fs.existsSync("data/private-beta/stability-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-stability-seal.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-stability-seal.md")).toBe(true);
  });

  it("seals beta stability without enabling public expansion", () => {
    const seal = JSON.parse(fs.readFileSync("data/private-beta/stability-seal.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-stability-seal.json", "utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_STABILITY_SEAL_READY");
    expect(seal.checks.monitorLoop).toBe("PASS");
    expect(seal.checks.dailyHealthSnapshot).toBe("PASS");
    expect(seal.checks.realUserObservation).toBe("PASS");
    expect(seal.checks.expansionDecisionGate).toBe("PASS");
    expect(seal.guards.critical5xx).toBe(0);
    expect(seal.guards.unauthorizedAccessEvents).toBe(0);
    expect(seal.guards.allowlistOnly).toBe(true);
    expect(seal.guards.publicSignupDisabled).toBe(true);
    expect(seal.guards.paymentLiveMode).toBe(false);
    expect(seal.guards.manualExpansionOnly).toBe(true);
    expect(audit.nextCanonicalPhase).toBe("Private beta launch communication pack");
  });
});
