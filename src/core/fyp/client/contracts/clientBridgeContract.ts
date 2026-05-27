import type { ClientFeedRequest } from "../types";

export function validateClientFeedRequest(
  request: ClientFeedRequest
): boolean {
  return Boolean(
    request.sessionId &&
    ["mobile", "desktop"].includes(request.viewport) &&
    typeof request.preload === "boolean"
  );
}
