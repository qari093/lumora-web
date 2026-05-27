import type {
  FeedApiItem,
  FeedApiRequest,
  FeedApiResponse
} from "../types";

import {
  validateFeedApiRequest
} from "../contracts/feedApiContract";

export function buildFeedApiResponse(
  request: FeedApiRequest,
  items: FeedApiItem[]
): FeedApiResponse {
  if (!validateFeedApiRequest(request)) {
    throw new Error("invalid_feed_api_request");
  }

  const limited = items
    .sort((a, b) => a.rank - b.rank)
    .slice(0, request.limit);

  return {
    ok: true,
    userId: request.userId,
    items: limited,
    nextCursor:
      items.length > request.limit
        ? limited[limited.length - 1]?.id ?? null
        : null
  };
}
