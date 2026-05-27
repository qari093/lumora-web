import type {
  FeedRouteQuery,
  FeedRouteResult
} from "../types";

import {
  validateFeedRouteQuery
} from "../contracts/feedRouteContract";

export function handleFeedRoute(
  query: FeedRouteQuery
): FeedRouteResult {
  if (!validateFeedRouteQuery(query)) {
    throw new Error("invalid_feed_route_query");
  }

  return {
    ok: true,
    route: "/api/fyp/feed",
    userId: query.userId,
    limit: query.limit,
    status: 200
  };
}
