type FeedItem = {
  id: string;
  kind: string;
  [key: string]: any;
};

type SponsoredItem = FeedItem & {
  kind: "sponsored";
  target: { type: "portal" | "external"; value: string };
};

export function injectSponsored(
  feed: FeedItem[],
  sponsoredPool: SponsoredItem[],
  maxSlots: number
): FeedItem[] {
  if (!Array.isArray(feed) || feed.length === 0) return [];

  if (!Array.isArray(sponsoredPool) || sponsoredPool.length === 0 || maxSlots <= 0) {
    return feed;
  }

  const result: FeedItem[] = [];
  let inserted = 0;
  let poolIndex = 0;

  for (let i = 0; i < feed.length; i++) {
    result.push(feed[i]);

    if (
      inserted < maxSlots &&
      (i + 1) % Math.ceil(feed.length / (maxSlots + 1)) === 0
    ) {
      const ad = sponsoredPool[poolIndex % sponsoredPool.length];
      result.push({
        ...ad,
        id: `sponsored_${Date.now()}_${inserted}`,
      });
      inserted++;
      poolIndex++;
    }
  }

  return result;
}
