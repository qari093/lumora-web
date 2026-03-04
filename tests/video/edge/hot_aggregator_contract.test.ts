import { describe, it, expect } from "vitest";
import { decideHotAggregator, hotCacheKey, normalizeHotLevel } from "@/lib/video/edge/hotAggregator";

describe("hot aggregator (two-tier) contract", () => {
  it("builds a stable cache key", () => {
    expect(hotCacheKey({ contentId: "v1", variant: "hls_720p" })).toBe("hot:v1:hls_720p");
  });

  it("normalizes level inputs", () => {
    expect(normalizeHotLevel("HOT")).toBe(1);
    expect(normalizeHotLevel("hotset")).toBe(2);
    expect(normalizeHotLevel("0")).toBe(0);
  });

  it("rejects invalid keys", () => {
    const d = decideHotAggregator({ key: { contentId: "../x", variant: "hls_720p" }, level: 1 });
    expect(d.ok).toBe(false);
  });

  it("enforces policy invariant: segment ttl < aggregator ttl", () => {
    const d = decideHotAggregator({
      key: { contentId: "v1", variant: "hls_720p" },
      level: 1,
      ttlSec: 60,
      segmentTtlSec: 60,
    });
    expect(d.ok).toBe(false);
    if (!d.ok) expect(d.error).toBe("policy_invalid");
  });

  it("defaults ttl based on level (HOT vs HOTSET) and clamps segment ttl", () => {
    const hot = decideHotAggregator({ key: { contentId: "v1", variant: "hls_720p" }, level: 1 });
    expect(hot.ok).toBe(true);
    if (hot.ok) {
      expect(hot.policy.ttlSec).toBeGreaterThanOrEqual(900);
      expect(hot.policy.segmentTtlSec).toBeLessThanOrEqual(120);
      expect(hot.policy.segmentTtlSec).toBeLessThan(hot.policy.ttlSec);
    }

    const hotset = decideHotAggregator({ key: { contentId: "v2", variant: "hls_1080p" }, level: 2 });
    expect(hotset.ok).toBe(true);
    if (hotset.ok) {
      expect(hotset.policy.ttlSec).toBeGreaterThanOrEqual(3600);
      expect(hotset.policy.segmentTtlSec).toBeLessThan(hotset.policy.ttlSec);
    }
  });
});
