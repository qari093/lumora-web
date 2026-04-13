export type AdEventInput = {
  impressions?: number;
  clicks?: number;
};

export type AdEventSummary = {
  impressions: number;
  clicks: number;
  ctr: number;
  engagementScore: number;
};

export function aggregateAdEvents(input: AdEventInput): AdEventSummary {
  const impressions = Math.max(0, Math.floor(input.impressions ?? 0));
  const clicks = Math.max(0, Math.floor(input.clicks ?? 0));

  const ctr = impressions === 0 ? 0 : clicks / impressions;

  // Weighted engagement (bounded)
  const engagementScore = Number(
    Math.min(1, ctr * 0.7 + (clicks > 0 ? 0.3 : 0)).toFixed(4)
  );

  return {
    impressions,
    clicks,
    ctr: Number(ctr.toFixed(4)),
    engagementScore,
  };
}
