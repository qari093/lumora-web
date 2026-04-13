export type CampaignAnalyticsInput = {
  campaignId?: string | null;
  impressions?: number | null;
  clicks?: number | null;
  spend?: number | null;
  conversions?: number | null;
};

export type CampaignAnalyticsResult =
  | {
      ok: true;
      snapshot: {
        campaignId: string;
        impressions: number;
        clicks: number;
        ctr: number;
        cpc: number;
        spend: number;
        conversions: number;
        conversionRate: number;
      };
    }
  | { ok: false; reason: string };

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function computeCampaignAnalytics(
  input: CampaignAnalyticsInput
): CampaignAnalyticsResult {
  const campaignId = typeof input.campaignId === "string" ? input.campaignId.trim() : "";
  const impressions =
    typeof input.impressions === "number" && Number.isFinite(input.impressions)
      ? Math.max(0, Math.trunc(input.impressions))
      : NaN;
  const clicks =
    typeof input.clicks === "number" && Number.isFinite(input.clicks)
      ? Math.max(0, Math.trunc(input.clicks))
      : NaN;
  const spend =
    typeof input.spend === "number" && Number.isFinite(input.spend)
      ? round2(Math.max(0, input.spend))
      : NaN;
  const conversions =
    typeof input.conversions === "number" && Number.isFinite(input.conversions)
      ? Math.max(0, Math.trunc(input.conversions))
      : 0;

  if (!campaignId) return { ok: false, reason: "missing_campaign_id" };
  if (!Number.isFinite(impressions)) return { ok: false, reason: "invalid_impressions" };
  if (!Number.isFinite(clicks)) return { ok: false, reason: "invalid_clicks" };
  if (!Number.isFinite(spend)) return { ok: false, reason: "invalid_spend" };

  if (clicks > impressions) {
    return { ok: false, reason: "clicks_exceed_impressions" };
  }

  const ctr = impressions > 0 ? round4(clicks / impressions) : 0;
  const cpc = clicks > 0 ? round4(spend / clicks) : 0;
  const conversionRate = clicks > 0 ? round4(conversions / clicks) : 0;

  return {
    ok: true,
    snapshot: {
      campaignId,
      impressions,
      clicks,
      ctr,
      cpc,
      spend,
      conversions,
      conversionRate,
    },
  };
}
