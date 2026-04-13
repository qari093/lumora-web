import { injectPersonalization, type FeedItem } from "@/lib/feed/personalize/engine";

export function injectDiscoveryLayer(): FeedItem[] {
  const feed = injectPersonalization();
  feed.push({ id: "discovery_001", type: "signal", score: 0.51 });
  return feed.sort((a, b) => b.score - a.score);
}
