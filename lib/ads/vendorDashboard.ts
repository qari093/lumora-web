export type VendorCampaignSummary = {
  campaignId: string;
  name: string;
  impressions: number;
  clicks: number;
  spend: number;
  active: boolean;
};

export type VendorDashboardInput = {
  vendorId?: string | null;
  campaigns?: VendorCampaignSummary[] | null;
};

export type VendorDashboardResult =
  | {
      ok: true;
      dashboard: {
        vendorId: string;
        totalCampaigns: number;
        activeCampaigns: number;
        totalImpressions: number;
        totalClicks: number;
        totalSpend: number;
        ctr: number;
      };
    }
  | { ok: false; reason: string };

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function buildVendorDashboard(
  input: VendorDashboardInput
): VendorDashboardResult {
  const vendorId = typeof input.vendorId === "string" ? input.vendorId.trim() : "";
  const campaigns = Array.isArray(input.campaigns) ? input.campaigns : [];

  if (!vendorId) return { ok: false, reason: "missing_vendor_id" };

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.active).length;
  const totalImpressions = campaigns.reduce((sum, c) => sum + Math.max(0, c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + Math.max(0, c.clicks || 0), 0);
  const totalSpend = round2(campaigns.reduce((sum, c) => sum + Math.max(0, c.spend || 0), 0));
  const ctr = totalImpressions > 0 ? round4(totalClicks / totalImpressions) : 0;

  return {
    ok: true,
    dashboard: {
      vendorId,
      totalCampaigns,
      activeCampaigns,
      totalImpressions,
      totalClicks,
      totalSpend,
      ctr,
    },
  };
}
