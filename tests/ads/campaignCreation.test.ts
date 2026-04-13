import { describe, expect, it } from "vitest";
import { createCampaignFlow } from "@/lib/ads/campaignCreation";

describe("campaign creation flow", () => {
  const now = 1_700_000_000_000;

  it("creates a valid campaign flow", () => {
    const out = createCampaignFlow({
      campaignId: "camp_1",
      vendorId: "vendor_1",
      name: "Launch Promo",
      dailyBudget: 100,
      lifetimeBudget: 1000,
      startAt: now,
      endAt: now + 86400000,
      isActive: true,
      creativeId: "creative_1",
      targetPortals: ["fyp", "gmar"],
    }, now);

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.creativeId).toBe("creative_1");
      expect(out.targetPortals).toEqual(["FYP", "GMAR"]);
    }
  });

  it("rejects missing creative", () => {
    const out = createCampaignFlow({
      campaignId: "camp_1",
      vendorId: "vendor_1",
      name: "Launch Promo",
      dailyBudget: 100,
      lifetimeBudget: 1000,
      startAt: now,
      endAt: now + 86400000,
      isActive: true,
      creativeId: " ",
      targetPortals: ["fyp"],
    }, now);

    expect(out).toEqual({ ok: false, reason: "missing_creative_id" });
  });

  it("rejects missing portals", () => {
    const out = createCampaignFlow({
      campaignId: "camp_1",
      vendorId: "vendor_1",
      name: "Launch Promo",
      dailyBudget: 100,
      lifetimeBudget: 1000,
      startAt: now,
      endAt: now + 86400000,
      isActive: true,
      creativeId: "creative_1",
      targetPortals: [],
    }, now);

    expect(out).toEqual({ ok: false, reason: "missing_target_portals" });
  });

  it("rejects invalid portal", () => {
    const out = createCampaignFlow({
      campaignId: "camp_1",
      vendorId: "vendor_1",
      name: "Launch Promo",
      dailyBudget: 100,
      lifetimeBudget: 1000,
      startAt: now,
      endAt: now + 86400000,
      isActive: true,
      creativeId: "creative_1",
      targetPortals: ["unknown"],
    }, now);

    expect(out).toEqual({ ok: false, reason: "invalid_target_portal" });
  });
});
