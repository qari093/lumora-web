import type {
  RankedFeedItem
} from "../real-feed/types";

export function balanceFeedDiversity(
  items: RankedFeedItem[],
  maxPerSource = 2
): RankedFeedItem[] {
  const counts = new Map<string, number>();

  return items.filter(item => {
    const count = counts.get(item.source) ?? 0;

    if (count >= maxPerSource) {
      return false;
    }

    counts.set(item.source, count + 1);
    return true;
  });
}
