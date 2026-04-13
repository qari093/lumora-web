export type SessionRollupInput = {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  sessionMinutes: number;
};

export type SessionRollupResult = {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  sessionMinutes: number;
  ctr: number;
  conversionRate: number;
  roi: number;
  revenuePerMinute: number;
};

export function createSessionRollup(
  input: SessionRollupInput
): SessionRollupResult {
  const impressions = Math.max(0, Math.floor(input.impressions ?? 0));
  const clicks = Math.max(0, Math.floor(input.clicks ?? 0));
  const conversions = Math.max(0, Math.floor(input.conversions ?? 0));
  const revenue = Math.max(0, Number(input.revenue ?? 0));
  const cost = Math.max(0, Number(input.cost ?? 0));
  const sessionMinutes = Math.max(1, Math.floor(input.sessionMinutes ?? 1));

  const ctr = impressions === 0 ? 0 : Number((clicks / impressions).toFixed(4));
  const conversionRate = clicks === 0 ? 0 : Number((conversions / clicks).toFixed(4));
  const roi =
    cost === 0
      ? (revenue > 0 ? 1 : 0)
      : Number((((revenue - cost) / cost)).toFixed(4));
  const revenuePerMinute = Number((revenue / sessionMinutes).toFixed(4));

  return {
    impressions,
    clicks,
    conversions,
    revenue,
    cost,
    sessionMinutes,
    ctr,
    conversionRate,
    roi,
    revenuePerMinute,
  };
}
