import { describe, expect, it } from "vitest";

import {
  validateClientFeedRequest
} from "@/src/core/fyp/client/contracts/clientBridgeContract";

import {
  createClientBridgePayload
} from "@/src/core/fyp/client/runtime/clientBridge";

import {
  runClientBridgeRuntime
} from "@/src/core/fyp/client/runtime/clientBridgeRuntime";

const request = {
  sessionId: "session_001",
  viewport: "mobile" as const,
  preload: true
};

describe("Lumora FYP Client Bridge Runtime Activation", () => {
  it("validates client feed request", () => {
    expect(validateClientFeedRequest(request)).toBe(true);
  });

  it("creates client bridge payload", () => {
    const payload = createClientBridgePayload(request);

    expect(payload.ok).toBe(true);
    expect(payload.hydrated).toBe(true);
  });

  it("supports desktop viewport", () => {
    const payload = createClientBridgePayload({
      ...request,
      viewport: "desktop"
    });

    expect(payload.viewport).toBe("desktop");
  });

  it("rejects invalid request", () => {
    expect(() =>
      createClientBridgePayload({
        ...request,
        sessionId: ""
      })
    ).toThrow("invalid_client_feed_request");
  });

  it("runs client bridge runtime", () => {
    const payload = runClientBridgeRuntime(request);

    expect(payload.sessionId).toBe("session_001");
    expect(payload.preload).toBe(true);
  });
});
