type RankedAd = {
  adId: string;
  performanceScore: number;
  portal?: string;
};

export function selectAds(input: {
  ranked: RankedAd[];
  maxSlots?: number;
}): RankedAd[] {
  const ranked = Array.isArray(input.ranked) ? input.ranked : [];
  const maxSlots = Math.max(1, Math.floor(input.maxSlots ?? 3));

  // Prioritize highest performers, ensure uniqueness
  const seen = new Set<string>();
  const selected: RankedAd[] = [];

  for (const ad of ranked) {
    if (!ad?.adId || seen.has(ad.adId)) continue;

    selected.push(ad);
    seen.add(ad.adId);

    if (selected.length >= maxSlots) break;
  }

  return selected;
}
