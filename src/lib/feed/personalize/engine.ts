import { rankFeed, type FeedItem } from "@/lib/feed/ranking/engine";

export function injectPersonalization(): FeedItem[] {
  return rankFeed().map((item, idx) => ({
    ...item,
    score: Number((item.score + (idx === 0 ? 0.03 : 0)).toFixed(3)),
  })).sort((a, b) => b.score - a.score);
}
