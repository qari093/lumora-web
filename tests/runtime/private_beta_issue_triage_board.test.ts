import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta issue triage board", () => {
  it("writes issue triage artifacts", () => {
    expect(fs.existsSync("data/private-beta/issue-triage-board.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-issue-triage-board.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-issue-triage-board.md")).toBe(true);
  });

  it("keeps triage conservative before expansion", () => {
    const board = JSON.parse(fs.readFileSync("data/private-beta/issue-triage-board.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-issue-triage-board.json", "utf8"));

    expect(board.status).toBe("PRIVATE_BETA_ISSUE_TRIAGE_READY");
    expect(board.mode).toBe("manual_priority_board");
    expect(board.rules.criticalBlocksNextWave).toBe(true);
    expect(board.rules.highRequiresReviewBeforeExpansion).toBe(true);
    expect(board.rules.paymentLiveMode).toBe(false);
    expect(board.rules.publicSignupDisabled).toBe(true);
    expect(board.rules.allowlistOnly).toBe(true);
    expect(Array.isArray(board.issues)).toBe(true);
    expect(audit.nextCanonicalPhase).toBe("Private beta retention signal snapshot");
  });
});
