type AdPerformance = {
  adId: string;
  performanceScore: number;
  ctr?: number;
  engagementScore?: number;
};

export function rankAds(input: { ads: AdPerformance[] }): AdPerformance[] {
  const ads = Array.isArray(input.ads) ? input.ads : [];

  return [...ads]
    .map((ad) => ({
      ...ad,
      performanceScore: Math.max(0, Math.min(1, Number(ad.performanceScore ?? 0))),
    }))
    .sort((a, b) => b.performanceScore - a.performanceScore);
}
