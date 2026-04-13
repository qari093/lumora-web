import { describe, expect, it } from "vitest";
import { createCampaign } from "@/lib/ads/campaign";

describe("vendor campaign system", () => {
  const now = 1_700_000_000_000;

  it("creates a valid campaign", () => {
    const out = createCampaign({
      campaignId: "camp_1",
      vendorId: "vendor_1",
      name: "Launch Promo",
      dailyBudget: 100,
      lifetimeBudget: 1000,
      startAt: now,
      endAt: now + 86400000,
      isActive: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.campaign.name).toBe("Launch Promo");
      expect(out.campaign.dailyBudget).toBe(100);
    }
  });

  it("rejects missing vendor", () => {
    const out = createCampaign({
      campaignId: "camp_1",
      vendorId: "",
      name: "Promo",
      dailyBudget: 100,
      lifetimeBudget: 1000,
      startAt: now,
      endAt: now + 1000,
      isActive: true,
    });

    expect(out).toEqual({ ok: false, reason: "missing_vendor_id" });
  });

  it("rejects daily > lifetime", () => {
    const out = createCampaign({
      campaignId: "camp_1",
      vendorId: "vendor_1",
      name: "Promo",
      dailyBudget: 200,
      lifetimeBudget: 100,
      startAt: now,
      endAt: now + 1000,
      isActive: true,
    });

    expect(out).toEqual({ ok: false, reason: "daily_exceeds_lifetime" });
  });

  it("rejects invalid time window", () => {
    const out = createCampaign({
      campaignId: "camp_1",
      vendorId: "vendor_1",
      name: "Promo",
      dailyBudget: 100,
      lifetimeBudget: 1000,
      startAt: now,
      endAt: now,
      isActive: true,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_end" });
  });
});
