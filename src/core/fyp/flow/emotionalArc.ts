import type { FeedItem } from "../core/types";

export type EmotionalArc = {
  arcId: string;
  itemCount: number;
  openingMode: string;
  closingMode: string;
  stable: boolean;
};

export function buildEmotionalArc(items: FeedItem[]): EmotionalArc {
  if (items.length === 0) {
    throw new Error("Emotional arc requires feed items.");
  }

  const openingMode = items[0].mode;
  const closingMode = items[items.length - 1].mode;
  const modeSwitches = items.reduce((count, item, index) => {
    if (index === 0) return count;
    return item.mode !== items[index - 1].mode ? count + 1 : count;
  }, 0);

  return {
    arcId: `arc_${openingMode}_${closingMode}_${items.length}`,
    itemCount: items.length,
    openingMode,
    closingMode,
    stable: modeSwitches <= Math.max(1, Math.floor(items.length / 3))
  };
}
