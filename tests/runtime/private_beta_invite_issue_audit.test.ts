import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta invite issue audit", () => {
  it("writes invite issue audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-invite-issue-audit.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-invite-issue-audit.md")).toBe(true);
    expect(fs.existsSync("data/private-beta/invite-list.json")).toBe(true);
  });

  it("passes only when invite issuing remains controlled", () => {
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-invite-issue-audit.json", "utf8"));
    const list = JSON.parse(fs.readFileSync("data/private-beta/invite-list.json", "utf8"));

    expect(audit.status).toBe("PRIVATE_BETA_INVITE_ISSUE_AUDIT_PASS");
    expect(audit.guards.inviteListExists).toBe(true);
    expect(audit.guards.allowlistOnly).toBe(true);
    expect(audit.guards.manualApprovalRequired).toBe(true);
    expect(audit.guards.publicSignupDisabled).toBe(true);
    expect(audit.guards.maxInvites).toBeLessThanOrEqual(25);
    expect(audit.guards.overIssueRisk).toBe(false);
    expect(audit.guards.paymentLiveMode).toBe(false);
    expect(list.invites.length).toBeLessThanOrEqual(list.maxInvites);
  });
});
