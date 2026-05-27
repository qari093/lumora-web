import type { FeedItem } from "./types";

export function calculateIntensityScore(item: FeedItem): number {
  const replay = item.replayWeight * 0.35;
  const novelty = item.novelty * 0.15;
  const base = item.intensity * 0.5;

  return Number((base + replay + novelty).toFixed(2));
}
