export function buildAdPerformance(input: {
  impressions: number;
  engagements: number;
  conversions: number;
  revenue: number;
}) {
  return {
    impressions: input.impressions,
    engagements: input.engagements,
    conversions: input.conversions,
    engagementRate:
      input.impressions > 0
        ? Number((input.engagements / input.impressions).toFixed(4))
        : 0,
    conversionRate:
      input.impressions > 0
        ? Number((input.conversions / input.impressions).toFixed(4))
        : 0,
    rpm:
      input.impressions > 0
        ? Number(((input.revenue / input.impressions) * 1000).toFixed(2))
        : 0,
  };
}
