import { describe, expect, it } from "vitest";
import { calculateRevenuePerUser } from "@/src/monetization/revenue-control/rpu";
import { compareRevenueTarget } from "@/src/monetization/revenue-control/comparator";
import { computeRevenueAdjustment } from "@/src/monetization/revenue-control/adjustment";
import { enforceRevenueGuardrails } from "@/src/monetization/revenue-control/guardrails";
import { evaluateRevenueControl } from "@/src/monetization/revenue-control/system";

describe("Monetization Pack15 — Revenue Control", () => {
  it("calculates RPU", () => {
    expect(calculateRevenuePerUser({ totalRevenue: 100, activeUsers: 10 })).toBe(10);
  });

  it("compares revenue target", () => {
    const result = compareRevenueTarget({ actualRPU: 0.03, targetRPU: 0.05 });
    expect(result.belowTarget).toBe(true);
  });

  it("adjusts revenue strategy", () => {
    const adj = computeRevenueAdjustment({ gap: 0.03, userState: "green" });
    expect(adj.action).toBe("increase_ads");
  });

  it("enforces guardrails", () => {
    const g = enforceRevenueGuardrails({
      adsPerSession: 10,
      maxAdsPerSession: 5,
      userState: "green",
    });
    expect(g.allowedAds).toBe(5);
  });

  it("evaluates full system", () => {
    const result = evaluateRevenueControl({
      totalRevenue: 100,
      activeUsers: 1000,
      targetRPU: 0.2,
      adsPerSession: 10,
      maxAdsPerSession: 5,
      userState: "green",
    });

    expect(result.ok).toBe(true);
    expect(result.guardrails.allowedAds).toBe(5);
  });
});
