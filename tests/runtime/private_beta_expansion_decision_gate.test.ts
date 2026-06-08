import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta expansion decision gate", () => {
  it("writes expansion decision artifacts", () => {
    expect(fs.existsSync("data/private-beta/expansion-decision-gate.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-expansion-decision-gate.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-expansion-decision-gate.md")).toBe(true);
  });

  it("holds wave 1 until real usage and manual review exist", () => {
    const gate = JSON.parse(fs.readFileSync("data/private-beta/expansion-decision-gate.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-expansion-decision-gate.json", "utf8"));

    expect(gate.status).toBe("PRIVATE_BETA_EXPANSION_DECISION_GATE_READY");
    expect(gate.decision).toBe("HOLD_WAVE_1");
    expect(gate.currentSampleSize).toBe(0);
    expect(gate.maxCurrentWaveInvites).toBeLessThanOrEqual(25);
    expect(gate.requiredBeforeExpansion.realUserUsageObserved).toBe(false);
    expect(gate.requiredBeforeExpansion.manualReviewCompleted).toBe(false);
    expect(gate.requiredBeforeExpansion.retentionSignalAvailable).toBe(false);
    expect(gate.guards.allowlistOnly).toBe(true);
    expect(gate.guards.publicSignupDisabled).toBe(true);
    expect(gate.guards.paymentLiveMode).toBe(false);
    expect(gate.guards.blockExpansionWithoutRetentionSignal).toBe(true);
    expect(audit.nextCanonicalPhase).toBe("Private beta stability seal");
  });
});
