import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta final monitoring seal", () => {
  it("writes final monitoring seal artifacts", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-final-monitoring-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora_private_beta_monitoring_sealed_lock")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-final-monitoring-seal.md")).toBe(true);
  });

  it("seals monitoring while keeping expansion controlled", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-final-monitoring-seal.json", "utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_MONITORING_SEALED");
    expect(seal.checks.monitorLoop).toBe("PASS");
    expect(seal.checks.firstWaveObservation).toBe("PASS");
    expect(seal.checks.dailyHealthSnapshot).toBe("PASS");
    expect(seal.checks.feedbackCollectionLoop).toBe("PASS");
    expect(seal.checks.issueTriageBoard).toBe("PASS");
    expect(seal.checks.retentionSignalSnapshot).toBe("PASS");
    expect(seal.guards.allowlistOnly).toBe(true);
    expect(seal.guards.publicSignupDisabled).toBe(true);
    expect(seal.guards.paymentLiveMode).toBe(false);
    expect(seal.guards.manualExpansionOnly).toBe(true);
    expect(seal.nextCanonicalPhase).toBe("Private beta real-user observation");
  });
});
