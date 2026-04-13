type FatigueAd = {
  adId: string;
  performanceScore: number;
  portal?: string;
  fatigueScore?: number;
  threshold?: number;
};

export function selectFatigueSafeAds(input: {
  ads: FatigueAd[];
  maxSlots?: number;
}): FatigueAd[] {
  const ads = Array.isArray(input.ads) ? input.ads : [];
  const maxSlots = Math.max(1, Math.floor(input.maxSlots ?? 3));

  const eligible = ads.filter((ad) => {
    const fatigueScore = Math.max(0, Math.min(1, Number(ad?.fatigueScore ?? 0)));
    const threshold = Math.max(0, Math.min(1, Number(ad?.threshold ?? 0.45)));
    return fatigueScore < threshold;
  });

  return eligible
    .map((ad) => ({
      ...ad,
      performanceScore: Math.max(0, Math.min(1, Number(ad.performanceScore ?? 0))),
      fatigueScore: Math.max(0, Math.min(1, Number(ad.fatigueScore ?? 0))),
      threshold: Math.max(0, Math.min(1, Number(ad.threshold ?? 0.45))),
    }))
    .sort((a, b) => b.performanceScore - a.performanceScore || a.adId.localeCompare(b.adId))
    .slice(0, maxSlots);
}
