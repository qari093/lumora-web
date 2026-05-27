import type {
  ClientBridgePayload,
  ClientFeedRequest
} from "../types";

import {
  createClientBridgePayload
} from "./clientBridge";

export function runClientBridgeRuntime(
  request: ClientFeedRequest
): ClientBridgePayload {
  return createClientBridgePayload(request);
}
