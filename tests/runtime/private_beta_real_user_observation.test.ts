import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta real user observation", () => {
  it("writes real-user observation artifacts", () => {
    expect(fs.existsSync("data/private-beta/real-user-observation.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-real-user-observation.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-real-user-observation.md")).toBe(true);
  });

  it("keeps expansion blocked until real usage exists", () => {
    const observation = JSON.parse(fs.readFileSync("data/private-beta/real-user-observation.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-real-user-observation.json", "utf8"));

    expect(observation.status).toBe("PRIVATE_BETA_REAL_USER_OBSERVATION_READY");
    expect(observation.mode).toBe("manual_real_user_observation");
    expect(observation.rules.allowlistOnly).toBe(true);
    expect(observation.rules.publicSignupDisabled).toBe(true);
    expect(observation.rules.paymentLiveMode).toBe(false);
    expect(observation.rules.doNotExpandWithoutRealUsage).toBe(true);
    expect(observation.signals.criticalIssues).toBe(0);
    expect(observation.signals.unauthorizedAccessEvents).toBe(0);
    expect(audit.nextCanonicalPhase).toBe("Private beta expansion decision gate");
  });
});
