import type {
  FeedMutation,
  MutatedFeedItem
} from "../types";

import {
  applyFeedMutation
} from "./feedMutationApplier";

export function runFeedMutationRuntime(
  baseScore: number,
  mutations: FeedMutation[]
): MutatedFeedItem[] {
  return mutations
    .map((mutation) => applyFeedMutation(baseScore, mutation))
    .filter((item) => !item.removed)
    .sort((a, b) => b.score - a.score);
}
