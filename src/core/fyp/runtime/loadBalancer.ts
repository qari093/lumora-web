import type {
  RuntimeFeedItem
} from "./types";

export function calculateEmotionalLoad(
  items: RuntimeFeedItem[]
): number {
  if (!items.length) return 0;

  const total = items.reduce(
    (sum, item) => sum + item.emotionalWeight,
    0
  );

  return Math.round(total / items.length);
}
