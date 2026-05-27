import type {
  FeedEndpointRequest,
  FeedEndpointResponse
} from "../types";

import {
  validateFeedEndpointRequest
} from "../contracts/feedEndpointContract";

export function buildFeedEndpointResponse(
  request: FeedEndpointRequest
): FeedEndpointResponse {
  if (!validateFeedEndpointRequest(request)) {
    throw new Error("invalid_feed_endpoint_request");
  }

  return {
    ok: true,
    userId: request.userId,
    items: [
      {
        id: "feed_item_001",
        rank: 100
      },
      {
        id: "feed_item_002",
        rank: 95
      }
    ],
    nextCursor: "cursor_002"
  };
}
