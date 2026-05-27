import type { FypFeedRecord } from "../types";

export function createFeedSeed(count = 12): FypFeedRecord[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `feed-seed-${index + 1}`,
    title: `Lumora Feed Seed ${index + 1}`,
    slug: `lumora-feed-seed-${index + 1}`,
    portal: "videos",
    rank: index + 1,
    score: 100 - index,
    createdAt: Date.now()
  }));
}
