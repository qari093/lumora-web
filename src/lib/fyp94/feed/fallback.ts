import type { Fyp94FeedItem } from "./types";

export function buildFyp94FallbackItems(count = 20): Fyp94FeedItem[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `fyp94_fallback_${index + 1}`,
    title: `Lumora Pulse Clip ${index + 1}`,
    category: index % 2 === 0 ? "adrenaline" : "cinematic",
    tags: index % 2 === 0 ? ["speed", "pulse"] : ["visual", "pulse"],
    playbackUrl: `/native-fyp/fallback/${index + 1}.mp4`,
    posterUrl: `/native-fyp/fallback/${index + 1}.jpg`,
    thrillScore: 70 + (index % 20),
    source: "lumora_owned",
    layer: "supply",
  }));
}

export function ensureFyp94NoEmptyFeed(items: Fyp94FeedItem[], target = 20): Fyp94FeedItem[] {
  if (items.length >= target) return items.slice(0, target);

  const existing = new Set(items.map((item) => item.id));
  const filler = buildFyp94FallbackItems(target).filter((item) => !existing.has(item.id));

  return [...items, ...filler].slice(0, target);
}
