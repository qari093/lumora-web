import { describe, expect, it } from "vitest";
import { adminOperations, adminOperationsHealthy } from "@/core/zencoin/admin/adminOperations";

describe("Zencoin Pack 21 — Admin + Operations", () => {
  it("supports admin dashboard", () => {
    expect(adminOperations.adminDashboard).toBe(true);
  });

  it("supports refund and suspicious activity operations", () => {
    expect(adminOperations.refundOperations).toBe(true);
    expect(adminOperations.suspiciousActivityManagement).toBe(true);
  });

  it("supports admin health", () => {
    expect(adminOperationsHealthy()).toBe(true);
  });
});
