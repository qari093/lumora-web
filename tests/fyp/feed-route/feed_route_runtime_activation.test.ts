import { describe, expect, it } from "vitest";

import {
  validateFeedRouteQuery,
  validateFeedRouteResult
} from "@/src/core/fyp/feed-route/contracts/feedRouteContract";

import {
  handleFeedRoute
} from "@/src/core/fyp/feed-route/runtime/feedRouteHandler";

import {
  runFeedRouteRuntime
} from "@/src/core/fyp/feed-route/runtime/feedRouteRuntime";

const query = {
  userId: "user_001",
  sessionId: "session_001",
  limit: 20
};

describe("Lumora FYP Feed Route Runtime Activation", () => {
  it("validates feed route query", () => {
    expect(validateFeedRouteQuery(query)).toBe(true);
  });

  it("handles feed route", () => {
    const result = handleFeedRoute(query);

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
  });

  it("validates feed route result", () => {
    const result = handleFeedRoute(query);

    expect(validateFeedRouteResult(result)).toBe(true);
  });

  it("rejects invalid route query", () => {
    expect(() =>
      handleFeedRoute({
        ...query,
        limit: 0
      })
    ).toThrow("invalid_feed_route_query");
  });

  it("runs feed route runtime", () => {
    const result = runFeedRouteRuntime(query);

    expect(result.route).toBe("/api/fyp/feed");
    expect(result.userId).toBe("user_001");
  });
});
