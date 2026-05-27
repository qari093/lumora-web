import type { Fyp94FeedItem } from "./types";

export function enforceFyp94Diversity(items: Fyp94FeedItem[], maxPerCategory = 5): Fyp94FeedItem[] {
  const counts: Record<string, number> = {};
  const primary: Fyp94FeedItem[] = [];
  const overflow: Fyp94FeedItem[] = [];

  for (const item of items) {
    counts[item.category] = counts[item.category] ?? 0;

    if (counts[item.category] < maxPerCategory) {
      counts[item.category]++;
      primary.push(item);
    } else {
      overflow.push(item);
    }
  }

  return [...primary, ...overflow];
}

export function enforceFyp94Cooldown(input: {
  items: Fyp94FeedItem[];
  recentlySeenIds: string[];
}): Fyp94FeedItem[] {
  const recent = new Set(input.recentlySeenIds);
  return input.items.filter((item) => !recent.has(item.id));
}
