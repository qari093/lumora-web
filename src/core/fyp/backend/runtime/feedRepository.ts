import type {
  FeedQuery,
  FeedResponse
} from "../types";

import { createFeedSeed } from "./feedSeed";

export async function getFeedRecords(
  query: FeedQuery
): Promise<FeedResponse> {
  const items = createFeedSeed(query.limit);

  return {
    ok: true,
    items,
    nextCursor: null
  };
}
