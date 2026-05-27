import type {
  FeedEndpointRequest,
  FeedEndpointResponse
} from "../types";

import {
  buildFeedEndpointResponse
} from "./feedEndpointBuilder";

export function runFeedEndpointRuntime(
  request: FeedEndpointRequest
): FeedEndpointResponse {
  return buildFeedEndpointResponse(request);
}
