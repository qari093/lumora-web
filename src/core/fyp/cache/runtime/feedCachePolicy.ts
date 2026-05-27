import type {
  FeedCacheDecision,
  FeedCacheEntry
} from "../types";

import {
  validateFeedCacheEntry
} from "../contracts/feedCacheContract";

export function evaluateFeedCacheEntry(
  entry: FeedCacheEntry,
  now: number
): FeedCacheDecision {
  if (!validateFeedCacheEntry(entry)) {
    throw new Error("invalid_feed_cache_entry");
  }

  const expired =
    now - entry.createdAt > entry.ttlMs;

  return {
    key: entry.key,
    hit: !expired,
    expired,
    reason: expired ? "cache_expired" : "cache_hit"
  };
}
