import type {
  FeedEndpointRequest,
  FeedEndpointResponse
} from "../types";

export function validateFeedEndpointRequest(
  request: FeedEndpointRequest
): boolean {
  return Boolean(
    request.userId &&
      request.limit > 0 &&
      request.limit <= 20
  );
}

export function validateFeedEndpointResponse(
  response: FeedEndpointResponse
): boolean {
  return Boolean(
    response.ok === true &&
      Array.isArray(response.items)
  );
}
