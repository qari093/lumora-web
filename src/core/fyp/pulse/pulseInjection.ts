import type { FeedItem } from "../core/types";
import type { PulseInjection } from "./types";

export function injectPulseContent(input: {
  items: FeedItem[];
  now?: number;
}): PulseInjection[] {
  const now = input.now ?? Date.now();

  return input.items
    .filter(item => item.intensity >= 7)
    .sort((a, b) => b.replayWeight - a.replayWeight)
    .slice(0, 6)
    .map(item => ({
      contentId: item.id,
      mode: item.mode,
      voltage:
        item.intensity * 10 +
        item.replayWeight * 2,
      injectedAt: now
    }));
}
