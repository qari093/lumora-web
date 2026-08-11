type FeedItem = {
  id: string;
  kind: string;
  [key: string]: any;
};

type AdItem = {
  adId: string;
  performanceScore: number;
  portal?: string;
  tier?: string;
  spent?: number;
  budget?: number;
  fatigueScore?: number;
  threshold?: number;
};

export function injectSelectedAds(input: {
  feed: FeedItem[];
  selected: AdItem[];
  everyN?: number;
}): FeedItem[] {
  const feed = Array.isArray(input.feed) ? input.feed : [];
  const selected = Array.isArray(input.selected) ? input.selected : [];
  const everyN = Math.max(1, Math.floor(input.everyN ?? 5));

  if (selected.length === 0) return feed;

  const result: FeedItem[] = [];
  let adIndex = 0;

  for (let i = 0; i < feed.length; i++) {
    result.push(feed[i]);

    if ((i + 1) % everyN === 0 && adIndex < selected.length) {
      const ad = selected[adIndex++];

      result.push({
        id: `feed_ad_${Date.now()}_${adIndex}`,
        kind: 'sponsored',
        adId: ad.adId,
        portal: ad.portal || 'FYP',
        performanceScore: ad.performanceScore,
        tier: ad.tier || 'low',
        spent: typeof ad.spent === 'number' ? ad.spent : 0,
        budget: typeof ad.budget === 'number' ? ad.budget : 0,
        fatigueScore: typeof ad.fatigueScore === 'number' ? ad.fatigueScore : 0,
        threshold: typeof ad.threshold === 'number' ? ad.threshold : 0.45,
        injected: true,
      });
    }
  }

  return result;
}
