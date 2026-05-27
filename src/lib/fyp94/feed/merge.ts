import type { Fyp94FeedItem } from "./types";

export function mergeFyp94ContentLayers(layers: Fyp94FeedItem[][]): Fyp94FeedItem[] {
  const seen = new Set<string>();
  const merged: Fyp94FeedItem[] = [];

  for (const layer of layers) {
    for (const item of layer) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
    }
  }

  return merged;
}
