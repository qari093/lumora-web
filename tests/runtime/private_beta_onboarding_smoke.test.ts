import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta onboarding smoke", () => {
  it("writes onboarding smoke artifacts", () => {
    expect(fs.existsSync("data/private-beta/onboarding-smoke.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-onboarding-smoke.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-onboarding-smoke.md")).toBe(true);
  });

  it("keeps onboarding invite-only and guarded", () => {
    const smoke = JSON.parse(fs.readFileSync("data/private-beta/onboarding-smoke.json", "utf8"));

    expect(smoke.status).toBe("PRIVATE_BETA_ONBOARDING_SMOKE_READY");
    expect(smoke.wave).toBe(1);
    expect(smoke.routes.go).toBe("/go");
    expect(smoke.routes.beta).toBe("/beta");
    expect(smoke.routes.privateAccess).toBe("/private-access");
    expect(smoke.guards.allowlistOnly).toBe(true);
    expect(smoke.guards.publicSignupDisabled).toBe(true);
    expect(smoke.guards.paymentLiveMode).toBe(false);
    expect(smoke.guards.manualApprovalRequired).toBe(true);
    expect(smoke.guards.inviteDispatchAudit).toBe("PASS");
    expect(smoke.nextCanonicalPhase).toBe("Private beta onboarding final seal");
  });
});
