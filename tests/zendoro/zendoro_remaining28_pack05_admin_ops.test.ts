import { describe, expect, it } from "vitest";
import { canZendoroAdmin, validateZendoroAdminOperations, zendoroAdminOperations } from "@/src/lib/zendoro/remaining28/adminOperations";

describe("Zendoro Remaining 28% Pack 5/9 — Admin Operations", () => {
  it("locks admin operation requirements", () => {
    expect(validateZendoroAdminOperations()).toBe(true);
    expect(zendoroAdminOperations.refundApproval).toBe(true);
    expect(zendoroAdminOperations.auditExplorer).toBe(true);
  });

  it("enforces admin role boundary", () => {
    expect(canZendoroAdmin("sellerApproval", "operator")).toBe(true);
    expect(canZendoroAdmin("rolePermissions", "operator")).toBe(false);
    expect(canZendoroAdmin("rolePermissions", "owner")).toBe(true);
  });
});
