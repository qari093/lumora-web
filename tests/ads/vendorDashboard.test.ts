import { describe, expect, it } from "vitest";
import { buildVendorDashboard } from "@/lib/ads/vendorDashboard";

describe("vendor dashboard (basic)", () => {
  it("builds aggregate dashboard metrics", () => {
    const out = buildVendorDashboard({
      vendorId: "vendor_1",
      campaigns: [
        {
          campaignId: "camp_1",
          name: "Launch 1",
          impressions: 1000,
          clicks: 100,
          spend: 50,
          active: true,
        },
        {
          campaignId: "camp_2",
          name: "Launch 2",
          impressions: 500,
          clicks: 25,
          spend: 20,
          active: false,
        },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.dashboard.totalCampaigns).toBe(2);
      expect(out.dashboard.activeCampaigns).toBe(1);
      expect(out.dashboard.totalImpressions).toBe(1500);
      expect(out.dashboard.totalClicks).toBe(125);
      expect(out.dashboard.totalSpend).toBe(70);
      expect(out.dashboard.ctr).toBeCloseTo(125 / 1500, 4);
    }
  });

  it("handles empty campaign list", () => {
    const out = buildVendorDashboard({
      vendorId: "vendor_1",
      campaigns: [],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.dashboard.totalCampaigns).toBe(0);
      expect(out.dashboard.ctr).toBe(0);
    }
  });

  it("rejects missing vendor id", () => {
    const out = buildVendorDashboard({
      vendorId: " ",
      campaigns: [],
    });

    expect(out).toEqual({ ok: false, reason: "missing_vendor_id" });
  });

  it("sanitizes negative metrics", () => {
    const out = buildVendorDashboard({
      vendorId: "vendor_1",
      campaigns: [
        {
          campaignId: "camp_1",
          name: "Bad Data",
          impressions: -10,
          clicks: -5,
          spend: -3,
          active: true,
        },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.dashboard.totalImpressions).toBe(0);
      expect(out.dashboard.totalClicks).toBe(0);
      expect(out.dashboard.totalSpend).toBe(0);
    }
  });
});
