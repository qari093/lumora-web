import { describe, expect, it } from "vitest";
import { chooseAdTiming } from "@/src/monetization/delivery/timing";
import { calculateSessionPacing } from "@/src/monetization/delivery/pacing";
import { shouldPrefetchAd } from "@/src/monetization/delivery/prefetch";
import { resolveAdDeliveryFallback } from "@/src/monetization/delivery/fallback";
import { evaluateAdDelivery } from "@/src/monetization/delivery/system";

describe("Monetization Pack16 — Delivery Optimization", () => {
  it("chooses safe ad timing", () => {
    expect(chooseAdTiming({
      userState: "green",
      sessionDepth: 8,
      completionJustHappened: true,
    }).slot).toBe("post_completion");

    expect(chooseAdTiming({
      userState: "red",
      sessionDepth: 8,
      completionJustHappened: true,
    }).slot).toBe("none");
  });

  it("calculates session pacing", () => {
    const pacing = calculateSessionPacing({
      videosWatched: 12,
      adsShown: 1,
      targetSpacing: 6,
    });

    expect(pacing.canServe).toBe(true);
    expect(pacing.expectedAds).toBe(2);
  });

  it("prefetches only when safe", () => {
    expect(shouldPrefetchAd({
      userState: "green",
      nextSlotEligible: true,
      networkQuality: "high",
    })).toBe(true);

    expect(shouldPrefetchAd({
      userState: "red",
      nextSlotEligible: true,
      networkQuality: "high",
    })).toBe(false);
  });

  it("resolves fallback safely", () => {
    expect(resolveAdDeliveryFallback({
      adAvailable: false,
      userState: "green",
    }).action).toBe("continue_content");

    expect(resolveAdDeliveryFallback({
      adAvailable: true,
      userState: "red",
    }).action).toBe("skip_ad");
  });

  it("validates full delivery system", () => {
    const result = evaluateAdDelivery({
      userState: "green",
      sessionDepth: 8,
      completionJustHappened: true,
      videosWatched: 12,
      adsShown: 1,
      targetSpacing: 6,
      networkQuality: "high",
      adAvailable: true,
    });

    expect(result.ok).toBe(true);
    expect(result.prefetch).toBe(true);
    expect(result.fallback.action).toBe("serve_ad");
  });
});
