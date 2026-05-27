import { describe, expect, it } from "vitest";
import { isAdEligible, allowedAdTypes } from "@/src/monetization/ads/eligibility";
import { isCooldownPassed } from "@/src/monetization/ads/cooldown";
import { canShowMoreAds } from "@/src/monetization/ads/frequency";
import { evaluateAdGate } from "@/src/monetization/ads/engine";

describe("Monetization Pack05 — Ad Eligibility Engine", () => {

  it("blocks ads in red state", () => {
    expect(isAdEligible({ state: "red" })).toBe(false);
  });

  it("allows correct ad types by state", () => {
    expect(allowedAdTypes("green")).toContain("reward");
    expect(allowedAdTypes("yellow")).toEqual(["native_feed"]);
  });

  it("enforces cooldown", () => {
    const now = Date.now();
    expect(isCooldownPassed({ now, minIntervalMs: 1000 })).toBe(true);
    expect(isCooldownPassed({ lastAdAt: now, now, minIntervalMs: 1000 })).toBe(false);
  });

  it("enforces frequency cap", () => {
    expect(canShowMoreAds({ adsShown: 1, maxAdsPerSession: 3 })).toBe(true);
    expect(canShowMoreAds({ adsShown: 3, maxAdsPerSession: 3 })).toBe(false);
  });

  it("evaluates full gating logic", () => {
    const result = evaluateAdGate({
      state: "green",
      now: Date.now(),
      minIntervalMs: 0,
      adsShown: 0,
      maxAdsPerSession: 3,
    });

    expect(result.allow).toBe(true);
    expect(result.types.length).toBeGreaterThan(0);
  });

});
