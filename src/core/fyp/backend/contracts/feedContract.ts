import type { FeedQuery } from "../types";

export function validateFeedQuery(input: Partial<FeedQuery>): FeedQuery {
  const limit = Math.max(1, Math.min(50, Number(input.limit ?? 12)));

  return {
    limit,
    cursor: input.cursor ?? null
  };
}
