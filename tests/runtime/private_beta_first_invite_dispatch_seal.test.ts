import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta first invite dispatch seal", () => {
  it("writes first invite dispatch seal artifacts", () => {
    expect(fs.existsSync("data/private-beta/first-invite-dispatch-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-first-invite-dispatch-seal.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-first-invite-dispatch-seal.md")).toBe(true);
  });

  it("keeps first invite dispatch manual and capped", () => {
    const seal = JSON.parse(fs.readFileSync("data/private-beta/first-invite-dispatch-seal.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-first-invite-dispatch-seal.json", "utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_FIRST_INVITE_DISPATCH_READY");
    expect(seal.dispatch.mode).toBe("manual_invite_only");
    expect(seal.dispatch.maxRecipients).toBeLessThanOrEqual(25);
    expect(seal.dispatch.allowlistOnly).toBe(true);
    expect(seal.dispatch.publicSignupDisabled).toBe(true);
    expect(seal.dispatch.paymentLiveMode).toBe(false);
    expect(seal.guards.noBulkPublicSend).toBe(true);
    expect(seal.guards.manualApprovalRequired).toBe(true);
    expect(audit.nextCanonicalPhase).toBe("Private beta invite dispatch audit");
  });
});
