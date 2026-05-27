import { describe, expect, it } from "vitest";
import { sellerDashboardReadinessScore, validateZendoroSellerDashboard, zendoroSellerDashboardModules } from "@/src/lib/zendoro/remaining28/sellerDashboard";

describe("Zendoro Remaining 28% Pack 4/9 — Seller Dashboard", () => {
  it("locks seller dashboard modules", () => {
    expect(validateZendoroSellerDashboard()).toBe(true);
    expect(zendoroSellerDashboardModules.productCrud).toBe(true);
    expect(zendoroSellerDashboardModules.payoutDashboard).toBe(true);
  });

  it("scores seller dashboard readiness", () => {
    expect(sellerDashboardReadinessScore()).toBe(100);
  });
});
