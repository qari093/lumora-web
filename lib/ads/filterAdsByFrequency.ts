type RankedAd = {
  adId: string;
  performanceScore: number;
  portal?: string;
  seenCount?: number;
};

export function filterAdsByFrequency(input: {
  ads: RankedAd[];
  maxPerSession?: number;
}): RankedAd[] {
  const ads = Array.isArray(input.ads) ? input.ads : [];
  const maxPerSession = Math.max(1, Math.floor(input.maxPerSession ?? 3));

  return ads.filter((ad) => {
    const seenCount = Math.max(0, Math.floor(ad?.seenCount ?? 0));
    return seenCount < maxPerSession;
  });
}
