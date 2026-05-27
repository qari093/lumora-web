import type { Fyp94FeedItem } from "./types";
import { mergeFyp94ContentLayers } from "./merge";
import { enforceFyp94Cooldown, enforceFyp94Diversity } from "./diversity";
import { ensureFyp94NoEmptyFeed } from "./fallback";
import { buildFyp94FeedResponse } from "./contract";

export function buildFyp94FinalFeed(input: {
  layers: Fyp94FeedItem[][];
  recentlySeenIds?: string[];
  targetSize?: number;
}) {
  const target = input.targetSize ?? 20;

  const merged = mergeFyp94ContentLayers(input.layers).sort((a, b) => b.thrillScore - a.thrillScore);
  const cooled = enforceFyp94Cooldown({
    items: merged,
    recentlySeenIds: input.recentlySeenIds ?? [],
  });
  const diverse = enforceFyp94Diversity(cooled);
  const finalItems = ensureFyp94NoEmptyFeed(diverse, target);

  return buildFyp94FeedResponse(finalItems);
}
