import type { FeedComposerItem } from "../types";

export function validateFeedComposerItem(
  item: FeedComposerItem
): boolean {
  return Boolean(
    item.id &&
    item.lane &&
    Number.isFinite(item.rankScore) &&
    Number.isFinite(item.qualityScore)
  );
}
