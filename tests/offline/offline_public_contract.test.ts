import { describe, it, expect } from "vitest";

// Contract: src/lib/offline/videos is the only supported surface.
import * as V from "../../src/lib/offline/videos";

describe("offline videos: public surface contract", () => {
  it("exports required functions", () => {
    expect(typeof (V as any).signFrame).toBe("function");
    expect(typeof (V as any).verifyFrame).toBe("function");

    // best-effort helpers (must exist as functions)
    expect(typeof (V as any).createInMemorySeenCache).toBe("function");
    expect(typeof (V as any).rateLimitConsume).toBe("function");

    // aliases must exist
    expect(typeof (V as any).seenCacheCreate).toBe("function");
    expect(typeof (V as any).p2pConsumeRateLimit).toBe("function");
  });

  it("helpers are callable and return structured outputs", async () => {
    const cache = (V as any).createInMemorySeenCache({ ttlMs: 50, max: 64 });
    expect(typeof cache?.seen).toBe("function");
    expect(cache.seen("x")).toBe(false);
    expect(cache.seen("x")).toBe(true);

    const r1 = (V as any).rateLimitConsume({ key: "k", limit: 2, windowMs: 1000 }, Date.now());
    expect(typeof r1?.ok).toBe("boolean");
    expect(typeof r1?.retryAfterMs).toBe("number");
    expect(typeof r1?.remaining).toBe("number");
  });
});
