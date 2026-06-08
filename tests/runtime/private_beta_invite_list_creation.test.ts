import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta invite list creation", () => {
  it("writes invite list and audit artifacts", () => {
    expect(fs.existsSync("data/private-beta/invite-list.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-invite-list-creation.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-invite-list-creation.md")).toBe(true);
  });

  it("keeps wave 1 invite list capped and allowlist-only", () => {
    const list = JSON.parse(fs.readFileSync("data/private-beta/invite-list.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-invite-list-creation.json", "utf8"));
    expect(list.status).toBe("INVITE_LIST_READY");
    expect(list.maxInvites).toBeLessThanOrEqual(25);
    expect(Array.isArray(list.invites)).toBe(true);
    expect(list.invites.length).toBeLessThanOrEqual(25);
    expect(list.rules.emailRequired).toBe(true);
    expect(list.rules.manualApprovalRequired).toBe(true);
    expect(list.rules.publicSignupDisabled).toBe(true);
    expect(list.rules.allowlistOnly).toBe(true);
    expect(audit.status).toBe("PRIVATE_BETA_INVITE_LIST_READY");
  });
});
