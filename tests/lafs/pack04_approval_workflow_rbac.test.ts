import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  applyApprovalDecision,
  approvalSummary,
  createApprovalRequest,
  getApprovalRule,
} from "../../src/core/lafs/approvals";

describe("LAFS Pack 04/08 approval workflow + RBAC", () => {
  it("selects approval rules by amount", () => {
    expect(getApprovalRule(49_999).requiredApprovals).toBe(1);
    expect(getApprovalRule(50_000).requiredApprovals).toBe(2);
    expect(getApprovalRule(50_000).requiredCouncilApprovals).toBe(1);
    expect(getApprovalRule(200_001).requiredApprovals).toBe(3);
    expect(getApprovalRule(200_001).requiredCouncilApprovals).toBe(3);
  });

  it("blocks self approval and duplicate approval", () => {
    const request = createApprovalRequest({
      id: "apr_test_1",
      amountMinor: 50_000,
      requestorId: "operator_a",
      nowIso: "2026-06-07T00:00:00.000Z",
    });

    expect(() =>
      applyApprovalDecision(request, {
        approverId: "operator_a",
        role: "operator",
        approved: true,
        decidedAt: "2026-06-07T01:00:00.000Z",
      })
    ).toThrow("self_approval_blocked");

    const next = applyApprovalDecision(request, {
      approverId: "operator_b",
      role: "operator",
      approved: true,
      decidedAt: "2026-06-07T01:00:00.000Z",
    });

    expect(() =>
      applyApprovalDecision(next, {
        approverId: "operator_b",
        role: "operator",
        approved: true,
        decidedAt: "2026-06-07T02:00:00.000Z",
      })
    ).toThrow("duplicate_approval_blocked");
  });

  it("requires council approval for mid-value approval", () => {
    const request = createApprovalRequest({
      id: "apr_test_2",
      amountMinor: 50_000,
      requestorId: "operator_a",
      nowIso: "2026-06-07T00:00:00.000Z",
    });

    const afterOperator = applyApprovalDecision(request, {
      approverId: "operator_b",
      role: "operator",
      approved: true,
      decidedAt: "2026-06-07T01:00:00.000Z",
    });

    expect(afterOperator.state).toBe("partially_approved");

    const afterCouncil = applyApprovalDecision(afterOperator, {
      approverId: "council_a",
      role: "council",
      approved: true,
      decidedAt: "2026-06-07T02:00:00.000Z",
    });

    expect(afterCouncil.state).toBe("approved");
    expect(approvalSummary(afterCouncil).currentCouncilApprovals).toBe(1);
  });

  it("expires requests after deadline", () => {
    const request = createApprovalRequest({
      id: "apr_test_3",
      amountMinor: 10_000,
      requestorId: "operator_a",
      nowIso: "2026-06-07T00:00:00.000Z",
      deadlineHours: 1,
    });

    const expired = applyApprovalDecision(
      request,
      {
        approverId: "operator_b",
        role: "operator",
        approved: true,
        decidedAt: "2026-06-07T02:00:00.000Z",
      },
      "2026-06-07T02:00:00.000Z"
    );

    expect(expired.state).toBe("expired");
  });

  it("writes approval workflow audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/lafs-pack04-approval-workflow-rbac.json")).toBe(true);
    expect(fs.existsSync("data/lafs/approval-workflow-rbac.json")).toBe(true);
    expect(fs.existsSync("docs/lafs/pack04-approval-workflow-rbac.md")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pack04_approval_rbac_lock")).toBe(true);

    const audit = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack04-approval-workflow-rbac.json", "utf8"));
    expect(audit.status).toBe("PASS");
    expect(audit.manifest.status).toBe("APPROVAL_WORKFLOW_RBAC_READY");
    expect(audit.manifest.guards.selfApprovalBlocked).toBe(true);
  });
});
