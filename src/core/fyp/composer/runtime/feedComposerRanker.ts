import type {
  FeedComposerItem,
  FeedComposerResult
} from "../types";

export function composeFeedRank(
  item: FeedComposerItem
): FeedComposerResult {
  const composedRank =
    (item.rankScore * 0.7) +
    (item.qualityScore * 0.3);

  return {
    ...item,
    composedRank
  };
}
