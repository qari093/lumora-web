import { describe, expect, it } from "vitest";
import {
  getZendoroAdminModerationRuntime,
  validateZendoroAdminModerationOperations,
} from "@/src/lib/zendoro/admin/adminModerationRuntime";

describe("Zendoro Pack 7/10 — Admin + Moderation Operations", () => {
  it("validates finalized admin/moderation runtime", () => {
    expect(validateZendoroAdminModerationOperations()).toBe(true);
  });

  it("tracks seller approval, moderation, refund, dispute, payout, audit, and RBAC coverage", () => {
    const runtime = getZendoroAdminModerationRuntime();

    expect(runtime.coverage.sellerApproval).toBe(true);
    expect(runtime.coverage.productModeration).toBe(true);
    expect(runtime.coverage.reviewModeration).toBe(true);
    expect(runtime.coverage.refundApproval).toBe(true);
    expect(runtime.coverage.disputeHandling).toBe(true);
    expect(runtime.coverage.payoutReview).toBe(true);
    expect(runtime.coverage.auditExplorer).toBe(true);
    expect(runtime.coverage.rolePermissions).toBe(true);
    expect(runtime.coverage.manualReviewQueue).toBe(true);
    expect(runtime.coverage.enforcementLogging).toBe(true);
    expect(runtime.routes).toContain("/admin/zendoro/audit");
    expect(runtime.apiRoutes).toContain("/api/admin/zendoro/audit");
  });
});
