import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta wave 1 live", () => {
  it("writes wave 1 live artifacts", () => {
    expect(fs.existsSync("data/private-beta/wave-1-live.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-wave-1-live.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-wave-1-live.md")).toBe(true);
  });

  it("keeps wave 1 live invite-only and controlled", () => {
    const live = JSON.parse(fs.readFileSync("data/private-beta/wave-1-live.json", "utf8"));

    expect(live.status).toBe("PRIVATE_BETA_WAVE_1_LIVE_READY");
    expect(live.wave).toBe(1);
    expect(live.mode).toBe("controlled_live_observation");
    expect(live.guards.allowlistOnly).toBe(true);
    expect(live.guards.publicSignupDisabled).toBe(true);
    expect(live.guards.paymentLiveMode).toBe(false);
    expect(live.guards.manualExpansionOnly).toBe(true);
    expect(live.guards.maxInvites).toBeLessThanOrEqual(25);
    expect(Object.values(live.checks).every((v) => v === "PASS")).toBe(true);
    expect(live.nextCanonicalPhase).toBe("Private beta live operations seal");
  });
});
