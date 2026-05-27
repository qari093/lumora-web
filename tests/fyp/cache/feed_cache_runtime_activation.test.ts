import { describe, expect, it } from "vitest";

import {
  validateFeedCacheEntry
} from "@/src/core/fyp/cache/contracts/feedCacheContract";

import {
  evaluateFeedCacheEntry
} from "@/src/core/fyp/cache/runtime/feedCachePolicy";

import {
  runFeedCacheRuntime
} from "@/src/core/fyp/cache/runtime/feedCacheRuntime";

const entry = {
  key: "feed:user_001",
  payloadHash: "hash_001",
  ttlMs: 1000,
  createdAt: 1000
};

describe("Lumora FYP Feed Cache Runtime Activation", () => {
  it("validates feed cache entry", () => {
    expect(validateFeedCacheEntry(entry)).toBe(true);
  });

  it("detects cache hit", () => {
    const decision = evaluateFeedCacheEntry(entry, 1500);

    expect(decision.hit).toBe(true);
    expect(decision.reason).toBe("cache_hit");
  });

  it("detects cache expiry", () => {
    const decision = evaluateFeedCacheEntry(entry, 2501);

    expect(decision.expired).toBe(true);
    expect(decision.reason).toBe("cache_expired");
  });

  it("rejects invalid cache entry", () => {
    expect(() =>
      evaluateFeedCacheEntry(
        {
          ...entry,
          ttlMs: 0
        },
        1500
      )
    ).toThrow("invalid_feed_cache_entry");
  });

  it("runs feed cache runtime", () => {
    const decisions = runFeedCacheRuntime([entry], 1500);

    expect(decisions).toHaveLength(1);
    expect(decisions[0].key).toBe("feed:user_001");
  });
});
