import type {
  FeedRouteQuery,
  FeedRouteResult
} from "../types";

import {
  handleFeedRoute
} from "./feedRouteHandler";

export function runFeedRouteRuntime(
  query: FeedRouteQuery
): FeedRouteResult {
  return handleFeedRoute(query);
}
