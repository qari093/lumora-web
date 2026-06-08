import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta invite dispatch audit", () => {
  it("writes invite dispatch audit artifacts", () => {
    expect(fs.existsSync("data/private-beta/invite-dispatch-audit.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-invite-dispatch-audit.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-invite-dispatch-audit.md")).toBe(true);
  });

  it("keeps invite dispatch capped and controlled", () => {
    const audit = JSON.parse(fs.readFileSync("data/private-beta/invite-dispatch-audit.json", "utf8"));

    expect(audit.status).toBe("PRIVATE_BETA_INVITE_DISPATCH_AUDIT_READY");
    expect(audit.wave).toBe(1);
    expect(audit.dispatch.sentCount).toBeLessThanOrEqual(audit.dispatch.maxRecipients);
    expect(audit.dispatch.maxRecipients).toBeLessThanOrEqual(25);
    expect(audit.dispatch.mode).toBe("manual_invite_only");
    expect(audit.dispatch.allowlistOnly).toBe(true);
    expect(audit.dispatch.publicSignupDisabled).toBe(true);
    expect(audit.dispatch.paymentLiveMode).toBe(false);
    expect(audit.guards.firstInviteDispatchSeal).toBe("PASS");
    expect(audit.guards.overDispatchRisk).toBe(false);
    expect(audit.nextCanonicalPhase).toBe("Private beta onboarding smoke");
  });
});
