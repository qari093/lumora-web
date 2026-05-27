import { describe, expect, it } from "vitest";

import {
  validateFeedEndpointRequest,
  validateFeedEndpointResponse
} from "@/src/core/fyp/feed-endpoint/contracts/feedEndpointContract";

import {
  buildFeedEndpointResponse
} from "@/src/core/fyp/feed-endpoint/runtime/feedEndpointBuilder";

import {
  runFeedEndpointRuntime
} from "@/src/core/fyp/feed-endpoint/runtime/feedEndpointRuntime";

const request = {
  userId: "user_001",
  cursor: null,
  limit: 10
} as const;

describe("Lumora FYP Feed Endpoint Wiring Activation", () => {
  it("validates feed endpoint request", () => {
    expect(validateFeedEndpointRequest(request)).toBe(true);
  });

  it("builds feed endpoint response", () => {
    const response = buildFeedEndpointResponse(request);

    expect(response.items).toHaveLength(2);
  });

  it("validates feed endpoint response", () => {
    const response = buildFeedEndpointResponse(request);

    expect(validateFeedEndpointResponse(response)).toBe(true);
  });

  it("rejects invalid endpoint request", () => {
    expect(() =>
      buildFeedEndpointResponse({
        ...request,
        limit: 0
      })
    ).toThrow("invalid_feed_endpoint_request");
  });

  it("runs feed endpoint runtime", () => {
    const response = runFeedEndpointRuntime(request);

    expect(response.userId).toBe("user_001");
  });
});
