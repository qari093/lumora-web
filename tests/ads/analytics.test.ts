import { describe, expect, it } from "vitest";
import { computeCampaignAnalytics } from "@/lib/ads/analytics";

describe("campaign analytics snapshot", () => {
  it("computes valid analytics", () => {
    const out = computeCampaignAnalytics({
      campaignId: "camp_1",
      impressions: 1000,
      clicks: 100,
      spend: 50,
      conversions: 20,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.snapshot.ctr).toBe(0.1);
      expect(out.snapshot.cpc).toBe(0.5);
      expect(out.snapshot.conversionRate).toBe(0.2);
    }
  });

  it("handles zero impressions safely", () => {
    const out = computeCampaignAnalytics({
      campaignId: "camp_1",
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversions: 0,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.snapshot.ctr).toBe(0);
      expect(out.snapshot.cpc).toBe(0);
    }
  });

  it("rejects clicks > impressions", () => {
    const out = computeCampaignAnalytics({
      campaignId: "camp_1",
      impressions: 10,
      clicks: 20,
      spend: 5,
    });

    expect(out).toEqual({ ok: false, reason: "clicks_exceed_impressions" });
  });

  it("rejects missing campaign id", () => {
    const out = computeCampaignAnalytics({
      campaignId: "",
      impressions: 100,
      clicks: 10,
      spend: 5,
    });

    expect(out).toEqual({ ok: false, reason: "missing_campaign_id" });
  });
});
