import { describe, expect, it } from "vitest";

import {
  validateFeedApiRequest,
  validateFeedApiResponse
} from "@/src/core/fyp/feed-api/contracts/feedApiContract";

import {
  buildFeedApiResponse
} from "@/src/core/fyp/feed-api/runtime/feedApiBuilder";

import {
  runFeedApiRuntime
} from "@/src/core/fyp/feed-api/runtime/feedApiRuntime";

const request = {
  userId: "user_001",
  sessionId: "session_001",
  limit: 2,
  cursor: null
};

const items = [
  {
    id: "item_002",
    rank: 2,
    source: "recommendation"
  },
  {
    id: "item_001",
    rank: 1,
    source: "recommendation"
  },
  {
    id: "item_003",
    rank: 3,
    source: "trend"
  }
];

describe("Lumora FYP Feed API Runtime Activation", () => {
  it("validates feed api request", () => {
    expect(validateFeedApiRequest(request)).toBe(true);
  });

  it("builds feed api response", () => {
    const response = buildFeedApiResponse(request, items);

    expect(response.ok).toBe(true);
    expect(response.items).toHaveLength(2);
  });

  it("sorts response items by rank", () => {
    const response = buildFeedApiResponse(request, items);

    expect(response.items[0].id).toBe("item_001");
  });

  it("creates next cursor", () => {
    const response = buildFeedApiResponse(request, items);

    expect(response.nextCursor).toBe("item_002");
  });

  it("runs feed api runtime", () => {
    const response = runFeedApiRuntime(request, items);

    expect(validateFeedApiResponse(response)).toBe(true);
  });
});
