import { describe, expect, it } from "vitest";
import { resolveCachePolicy } from "@/lib/system/edgeCaching";

describe("edge caching strategy", () => {
  it("applies edge cache for static content", () => {
    const out = resolveCachePolicy({
      path: "/assets/img.png",
      isStatic: true,
      isPersonalized: false,
      maxAgeSec: 100,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.policy.strategy).toBe("edge-cache");
      expect(out.policy.ttl).toBeGreaterThanOrEqual(3600);
    }
  });

  it("disables cache for personalized content", () => {
    const out = resolveCachePolicy({
      path: "/fyp",
      isStatic: false,
      isPersonalized: true,
      maxAgeSec: 100,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.policy.strategy).toBe("no-cache");
      expect(out.policy.cacheable).toBe(false);
    }
  });

  it("uses private cache for dynamic non-personalized", () => {
    const out = resolveCachePolicy({
      path: "/explore",
      isStatic: false,
      isPersonalized: false,
      maxAgeSec: 120,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.policy.strategy).toBe("private-cache");
      expect(out.policy.ttl).toBe(120);
    }
  });

  it("rejects invalid path", () => {
    const out = resolveCachePolicy({
      path: "invalid",
      isStatic: false,
      isPersonalized: false,
      maxAgeSec: 100,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_path" });
  });
});
