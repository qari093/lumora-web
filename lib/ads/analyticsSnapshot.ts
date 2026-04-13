export type AnalyticsSnapshotInput = {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
};

export type AnalyticsSnapshot = {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  roi: number;
  profitable: boolean;
  createdAt: number;
};

export function createAnalyticsSnapshot(
  input: AnalyticsSnapshotInput
): AnalyticsSnapshot {
  const impressions = Math.max(0, Math.floor(input.impressions ?? 0));
  const clicks = Math.max(0, Math.floor(input.clicks ?? 0));
  const conversions = Math.max(0, Math.floor(input.conversions ?? 0));
  const revenue = Math.max(0, Number(input.revenue ?? 0));
  const cost = Math.max(0, Number(input.cost ?? 0));

  const ctr = impressions === 0 ? 0 : Number((clicks / impressions).toFixed(4));
  const conversionRate = clicks === 0 ? 0 : Number((conversions / clicks).toFixed(4));
  const roi =
    cost === 0
      ? (revenue > 0 ? 1 : 0)
      : Number((((revenue - cost) / cost)).toFixed(4));

  return {
    impressions,
    clicks,
    conversions,
    ctr,
    conversionRate,
    roi,
    profitable: revenue >= cost,
    createdAt: Date.now(),
  };
}
