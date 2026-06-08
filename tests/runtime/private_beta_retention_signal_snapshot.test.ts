import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta retention signal snapshot", () => {
  it("writes retention signal artifacts", () => {
    expect(fs.existsSync("data/private-beta/retention-signal-snapshot.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-retention-signal-snapshot.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-retention-signal-snapshot.md")).toBe(true);
  });

  it("keeps expansion blocked until real retention signal exists", () => {
    const snapshot = JSON.parse(fs.readFileSync("data/private-beta/retention-signal-snapshot.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-retention-signal-snapshot.json", "utf8"));

    expect(snapshot.status).toBe("PRIVATE_BETA_RETENTION_SIGNAL_READY");
    expect(snapshot.wave).toBe(1);
    expect(snapshot.sampleSize).toBe(0);
    expect(snapshot.guards.doNotExpandWithoutSignal).toBe(true);
    expect(snapshot.guards.manualReviewRequired).toBe(true);
    expect(snapshot.guards.paymentLiveMode).toBe(false);
    expect(snapshot.guards.publicSignupDisabled).toBe(true);
    expect(snapshot.guards.allowlistOnly).toBe(true);
    expect(audit.nextCanonicalPhase).toBe("Private beta final monitoring seal");
  });
});
