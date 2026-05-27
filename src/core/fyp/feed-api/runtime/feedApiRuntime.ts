import type {
  FeedApiItem,
  FeedApiRequest,
  FeedApiResponse
} from "../types";

import {
  buildFeedApiResponse
} from "./feedApiBuilder";

export function runFeedApiRuntime(
  request: FeedApiRequest,
  items: FeedApiItem[]
): FeedApiResponse {
  return buildFeedApiResponse(request, items);
}
