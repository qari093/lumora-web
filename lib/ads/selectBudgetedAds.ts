type BudgetedAd = {
  adId: string;
  performanceScore: number;
  portal?: string;
  spent?: number;
  budget?: number;
};

export function selectBudgetedAds(input: {
  ads: BudgetedAd[];
  maxSlots?: number;
}): BudgetedAd[] {
  const ads = Array.isArray(input.ads) ? input.ads : [];
  const maxSlots = Math.max(1, Math.floor(input.maxSlots ?? 3));

  const eligible = ads.filter((ad) => {
    const spent = Math.max(0, Number(ad?.spent ?? 0));
    const budget = Math.max(0, Number(ad?.budget ?? 0));
    return budget > 0 && spent < budget;
  });

  return eligible
    .map((ad) => ({
      ...ad,
      performanceScore: Math.max(0, Math.min(1, Number(ad.performanceScore ?? 0))),
    }))
    .sort((a, b) => b.performanceScore - a.performanceScore || a.adId.localeCompare(b.adId))
    .slice(0, maxSlots);
}
