type TieredAd = {
  adId: string;
  performanceScore: number;
  tier?: "low" | "medium" | "high" | "elite";
  portal?: string;
};

const TIER_WEIGHT: Record<NonNullable<TieredAd["tier"]>, number> = {
  low: 1,
  medium: 2,
  high: 3,
  elite: 4,
};

export function selectTieredAds(input: {
  ads: TieredAd[];
  maxSlots?: number;
}): TieredAd[] {
  const ads = Array.isArray(input.ads) ? input.ads : [];
  const maxSlots = Math.max(1, Math.floor(input.maxSlots ?? 3));

  const ranked = [...ads]
    .map((ad) => {
      const tier = ad.tier ?? "low";
      const weight = TIER_WEIGHT[tier];
      return {
        ...ad,
        tier,
        performanceScore: Math.max(0, Math.min(1, Number(ad.performanceScore ?? 0))),
        _sortScore: Number((Math.max(0, Math.min(1, Number(ad.performanceScore ?? 0))) + weight * 0.1).toFixed(4)),
      };
    })
    .sort((a, b) => b._sortScore - a._sortScore || a.adId.localeCompare(b.adId));

  return ranked.slice(0, maxSlots).map(({ _sortScore, ...rest }) => rest);
}
