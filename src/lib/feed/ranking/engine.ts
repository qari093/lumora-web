import { assembleFeed, type FeedItem } from "@/lib/feed/assembler/engine";

export function rankFeed(): FeedItem[] {
  return assembleFeed().sort((a, b) => b.score - a.score);
}
export type { FeedItem } from "@/lib/feed/assembler/engine";
