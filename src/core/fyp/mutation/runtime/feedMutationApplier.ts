import type {
  FeedMutation,
  MutatedFeedItem
} from "../types";

import {
  validateFeedMutation
} from "../contracts/feedMutationContract";

export function applyFeedMutation(
  baseScore: number,
  mutation: FeedMutation
): MutatedFeedItem {
  if (!validateFeedMutation(mutation)) {
    throw new Error("invalid_feed_mutation");
  }

  if (mutation.type === "remove") {
    return {
      itemId: mutation.itemId,
      score: 0,
      removed: true
    };
  }

  const delta =
    mutation.type === "boost" || mutation.type === "insert"
      ? mutation.weight
      : -mutation.weight;

  return {
    itemId: mutation.itemId,
    score: Math.max(0, baseScore + delta),
    removed: false
  };
}
