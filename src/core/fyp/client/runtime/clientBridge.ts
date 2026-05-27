import type {
  ClientBridgePayload,
  ClientFeedRequest
} from "../types";

import {
  validateClientFeedRequest
} from "../contracts/clientBridgeContract";

export function createClientBridgePayload(
  request: ClientFeedRequest
): ClientBridgePayload {
  if (!validateClientFeedRequest(request)) {
    throw new Error("invalid_client_feed_request");
  }

  return {
    ok: true,
    sessionId: request.sessionId,
    viewport: request.viewport,
    preload: request.preload,
    hydrated: true
  };
}
