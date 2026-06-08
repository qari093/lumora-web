import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta first wave observation", () => {
  it("writes first wave observation artifacts", () => {
    expect(fs.existsSync("data/private-beta/first-wave-observation.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-first-wave-observation.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-first-wave-observation.md")).toBe(true);
  });

  it("keeps first wave capped and guarded", () => {
    const plan = JSON.parse(fs.readFileSync("data/private-beta/first-wave-observation.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-first-wave-observation.json", "utf8"));

    expect(plan.status).toBe("PRIVATE_BETA_FIRST_WAVE_OBSERVATION_READY");
    expect(plan.wave).toBe(1);
    expect(plan.maxInvites).toBeLessThanOrEqual(25);
    expect(plan.observationWindowDays).toBeGreaterThanOrEqual(7);
    expect(plan.paymentLiveMode).toBe(false);
    expect(plan.publicSignupDisabled).toBe(true);
    expect(plan.allowlistOnly).toBe(true);
    expect(plan.pauseRules.anyCritical5xx).toBe(true);
    expect(audit.status).toBe("PRIVATE_BETA_FIRST_WAVE_OBSERVATION_READY");
    expect(audit.nextCanonicalPhase).toBe("Private beta daily health snapshot");
  });
});
