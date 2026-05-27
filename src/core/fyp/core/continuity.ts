import type { FeedItem } from "./types";

export function calculateContinuity(
  previous: FeedItem,
  next: FeedItem
): number {
  let score = 100;

  if (previous.mode !== next.mode) {
    score -= 30;
  }

  const intensityGap = Math.abs(
    previous.intensity - next.intensity
  );

  score -= intensityGap * 10;

  return Math.max(0, score);
}
