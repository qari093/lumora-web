import { describe, expect, it } from "vitest";
import { createMonetizationPulseMetrics } from "@/src/monetization/pulse/metrics";
import { trackRevenue } from "@/src/monetization/pulse/revenue";
import { buildCreatorStats } from "@/src/monetization/pulse/creatorStats";
import { buildAdPerformance } from "@/src/monetization/pulse/adPerformance";
import { buildMonetizationPulseDashboard } from "@/src/monetization/pulse/dashboard";

describe("Monetization Pack19 — Analytics & Pulse", () => {
  it("creates healthy pulse metrics", () => {
    const metrics = createMonetizationPulseMetrics({
      revenuePerSession: 0.04,
      adEngagementRate: 0.2,
      zenVelocity: 50,
      creatorPayoutTotal: 100,
      protectedStateShare: 0.2,
    });

    expect(metrics.healthy).toBe(true);
  });

  it("tracks gross and net revenue", () => {
    const revenue = trackRevenue({
      adRevenue: 100,
      zenSpendRevenue: 50,
      creatorCost: 40,
    });

    expect(revenue.gross).toBe(150);
    expect(revenue.net).toBe(110);
  });

  it("builds creator stats", () => {
    const stats = buildCreatorStats({
      creatorCount: 10,
      payoutTotal: 100,
      eligibleCreators: 8,
    });

    expect(stats.avgPayout).toBe(10);
    expect(stats.eligibleCreators).toBe(8);
  });

  it("builds ad performance", () => {
    const ads = buildAdPerformance({
      impressions: 1000,
      engagements: 100,
      conversions: 10,
      revenue: 20,
    });

    expect(ads.engagementRate).toBe(0.1);
    expect(ads.conversionRate).toBe(0.01);
    expect(ads.rpm).toBe(20);
  });

  it("builds full monetization pulse dashboard", () => {
    const dashboard = buildMonetizationPulseDashboard({
      metrics: {
        revenuePerSession: 0.05,
        adEngagementRate: 0.2,
        zenVelocity: 30,
        creatorPayoutTotal: 50,
        protectedStateShare: 0.1,
      },
      revenue: {
        adRevenue: 100,
        zenSpendRevenue: 20,
        creatorCost: 30,
      },
      creators: {
        creatorCount: 10,
        payoutTotal: 50,
        eligibleCreators: 6,
      },
      ads: {
        impressions: 1000,
        engagements: 120,
        conversions: 12,
        revenue: 24,
      },
    });

    expect(dashboard.ok).toBe(true);
    expect(dashboard.revenue.net).toBe(90);
    expect(dashboard.ads.rpm).toBe(24);
  });
});
