import type {
  FeedApiRequest,
  FeedApiResponse
} from "../types";

export function validateFeedApiRequest(
  request: FeedApiRequest
): boolean {
  return Boolean(
    request.userId &&
      request.sessionId &&
      Number.isInteger(request.limit) &&
      request.limit > 0 &&
      request.limit <= 50 &&
      (
        request.cursor === null ||
        typeof request.cursor === "string"
      )
  );
}

export function validateFeedApiResponse(
  response: FeedApiResponse
): boolean {
  return Boolean(
    response.ok === true &&
      response.userId &&
      Array.isArray(response.items)
  );
}
