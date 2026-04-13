export type ExposureSummaryInput = {
  impressions: number;
  clicks: number;
  conversions: number;
  uniqueAdsSeen: number;
};

export type ExposureSummaryResult = {
  impressions: number;
  clicks: number;
  conversions: number;
  uniqueAdsSeen: number;
  clickThroughRate: number;
  conversionRate: number;
  adsPerClick: number;
};

export function createExposureSummary(
  input: ExposureSummaryInput
): ExposureSummaryResult {
  const impressions = Math.max(0, Math.floor(input.impressions ?? 0));
  const clicks = Math.max(0, Math.floor(input.clicks ?? 0));
  const conversions = Math.max(0, Math.floor(input.conversions ?? 0));
  const uniqueAdsSeen = Math.max(0, Math.floor(input.uniqueAdsSeen ?? 0));

  const clickThroughRate =
    impressions === 0 ? 0 : Number((clicks / impressions).toFixed(4));

  const conversionRate =
    clicks === 0 ? 0 : Number((conversions / clicks).toFixed(4));

  const adsPerClick =
    clicks === 0 ? 0 : Number((uniqueAdsSeen / clicks).toFixed(4));

  return {
    impressions,
    clicks,
    conversions,
    uniqueAdsSeen,
    clickThroughRate,
    conversionRate,
    adsPerClick,
  };
}
