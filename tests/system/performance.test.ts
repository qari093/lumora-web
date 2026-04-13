import { describe, expect, it } from "vitest";
import { evaluatePerformance } from "@/lib/system/performance";

describe("performance optimization pass", () => {
  it("reports optimal performance", () => {
    const out = evaluatePerformance({
      endpoints: [
        { path: "/fyp", ttfbMs: 120, cacheHit: true },
        { path: "/live", ttfbMs: 200, cacheHit: true },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.summary.status).toBe("optimal");
      expect(out.summary.cacheHitRate).toBe(1);
    }
  });

  it("reports degraded performance", () => {
    const out = evaluatePerformance({
      endpoints: [
        { path: "/fyp", ttfbMs: 600, cacheHit: false },
        { path: "/live", ttfbMs: 700, cacheHit: false },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.summary.status).toBe("degraded");
      expect(out.summary.slowEndpoints).toBe(2);
    }
  });

  it("rejects invalid path", () => {
    const out = evaluatePerformance({
      endpoints: [{ path: "", ttfbMs: 100, cacheHit: true }],
    });

    expect(out).toEqual({ ok: false, reason: "invalid_path" });
  });

  it("rejects invalid ttfb", () => {
    const out = evaluatePerformance({
      endpoints: [{ path: "/fyp", ttfbMs: -1, cacheHit: true }],
    });

    expect(out).toEqual({ ok: false, reason: "invalid_ttfb" });
  });
});
