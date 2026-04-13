import { describe, expect, it } from "vitest";
import { integrateAdServing } from "@/lib/ads/serving";

const organicFeed = [
  { id: "o1", title: "Post 1", category: "GMAR" },
  { id: "o2", title: "Post 2", category: "NEXA" },
  { id: "o3", title: "Post 3", category: "LIVE" },
  { id: "o4", title: "Post 4", category: "MOVIES" },
  { id: "o5", title: "Post 5", category: "SOCIAL" },
  { id: "o6", title: "Post 6", category: "GMAR" },
];

const internalAds = [
  {
    id: "ad1",
    title: "GMAR Promo",
    category: "GMAR",
    kind: "sponsored" as const,
    source: "internal_portal" as const,
    portal: "GMAR" as const,
  },
];

describe("ad serving logic integration", () => {
  it("returns organic feed when disabled", () => {
    const out = integrateAdServing({
      organicFeed,
      internalAds,
      activation: {
        enabled: false,
        mode: "disabled",
        allowExternal: false,
        maxSponsoredPerFeed: 0,
        maxDailyImpressions: 0,
      },
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.inserted).toBe(0);
      expect(out.feed).toHaveLength(organicFeed.length);
    }
  });

  it("injects internal ad in shadow mode", () => {
    const out = integrateAdServing({
      organicFeed,
      internalAds,
      activation: {
        enabled: true,
        mode: "shadow",
        allowExternal: false,
        maxSponsoredPerFeed: 1,
        maxDailyImpressions: 100,
      },
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.inserted).toBe(1);
      expect(out.feed.some((x) => x.kind === "sponsored")).toBe(true);
    }
  });

  it("never places ad first", () => {
    const out = integrateAdServing({
      organicFeed,
      internalAds,
      activation: {
        enabled: true,
        mode: "controlled",
        allowExternal: false,
        maxSponsoredPerFeed: 1,
        maxDailyImpressions: 100,
      },
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.feed[0].id).toBe("o1");
    }
  });

  it("returns activation error when config invalid", () => {
    const out = integrateAdServing({
      organicFeed,
      internalAds,
      activation: {
        enabled: false,
        mode: "controlled",
        allowExternal: false,
        maxSponsoredPerFeed: 1,
        maxDailyImpressions: 100,
      },
    });

    expect(out).toEqual({ ok: false, reason: "mode_requires_enabled_ads" });
  });
});
