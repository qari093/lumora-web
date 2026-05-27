import type {
  FeedComposerItem,
  FeedComposerRuntimeResult
} from "../types";

import {
  validateFeedComposerItem
} from "../contracts/feedComposerContract";

import {
  composeFeedRank
} from "./feedComposerRanker";

export function runFeedComposerRuntime(
  items: FeedComposerItem[]
): FeedComposerRuntimeResult {
  const valid = items.filter(validateFeedComposerItem);

  const ranked = valid
    .map(composeFeedRank)
    .sort((a, b) => b.composedRank - a.composedRank);

  return {
    ok: true,
    total: ranked.length,
    items: ranked
  };
}
