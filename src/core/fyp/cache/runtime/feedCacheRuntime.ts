import type {
  FeedCacheDecision,
  FeedCacheEntry
} from "../types";

import {
  evaluateFeedCacheEntry
} from "./feedCachePolicy";

export function runFeedCacheRuntime(
  entries: FeedCacheEntry[],
  now: number
): FeedCacheDecision[] {
  return entries.map((entry) =>
    evaluateFeedCacheEntry(entry, now)
  );
}
