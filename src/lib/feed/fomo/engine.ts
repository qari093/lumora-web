import { injectDiscoveryLayer, type FeedItem } from "@/lib/feed/discovery/engine";

export function injectFomoContent(): FeedItem[] {
  const feed = injectDiscoveryLayer();
  feed.unshift({ id: "fomo_001", type: "trailer", score: 0.97 });
  return feed.sort((a, b) => b.score - a.score);
}
export type { FeedItem } from "@/lib/feed/discovery/engine";
