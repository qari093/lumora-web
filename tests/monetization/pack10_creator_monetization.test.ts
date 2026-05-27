import { describe, expect, it } from "vitest";
import { calculateCreatorRevenueWeight } from "@/src/monetization/creator/revenueSignals";
import { calculateCreatorPayout } from "@/src/monetization/creator/payout";
import { buildCreatorMonetizationDashboard } from "@/src/monetization/creator/dashboard";
import { applyCreatorTrustMultiplier } from "@/src/monetization/creator/trustMultiplier";
import { validateCreatorEarnings } from "@/src/monetization/creator/validate";

describe("Monetization Pack10 — Creator Monetization", () => {
  it("maps signals into creator revenue weight", () => {
    const weight = calculateCreatorRevenueWeight({
      holdDepth: 0.8,
      rewatchCount: 2,
      completionRate: 0.7,
      drift: 0.1,
    });

    expect(weight).toBeGreaterThan(0.5);
  });

  it("calculates creator payout from revenue pool", () => {
    expect(calculateCreatorPayout({
      revenuePool: 100,
      creatorWeight: 2,
      totalWeight: 10,
    })).toBe(20);
  });

  it("builds creator monetization dashboard model", () => {
    const dashboard = buildCreatorMonetizationDashboard({
      creatorId: "c1",
      estimatedPayout: 20,
      zenEarned: 50,
      zenScore: 0.8,
      eligible: true,
    });

    expect(dashboard.visibility).toBe("active");
    expect(dashboard.creatorId).toBe("c1");
  });

  it("applies trust multiplier", () => {
    const out = applyCreatorTrustMultiplier({
      basePayout: 100,
      zenScore: 0.85,
    });

    expect(out.multiplier).toBe(1.15);
    expect(out.payout).toBe(115);
  });

  it("validates creator earnings", () => {
    expect(validateCreatorEarnings({
      payout: 10,
      zenEarned: 20,
      eligible: true,
    }).ok).toBe(true);
  });
});
