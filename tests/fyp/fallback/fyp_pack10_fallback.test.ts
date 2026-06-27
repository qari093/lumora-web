import { describe, it, expect } from "vitest";

import {
  resolveFypFallback
} from "../../../src/core/fyp/fallback/fallbackResolver";

import {
  shouldTriggerFallbackExhaustionAlert
} from "../../../src/core/fyp/fallback/fallbackExhaustion";

describe("FYP Omega Pack 10", () => {
  it("uses primary when healthy", () => {
    const result = resolveFypFallback({
      primaryUrl: "https://cdn.example.com/main.mp4",
      cdnFallbackUrl: "https://cdn.example.com/fallback.mp4",
      primaryHealthy: true,
      cdnFallbackHealthy: true
    });

    expect(result.tier).toBe("primary");
  });

  it("uses cdn fallback when primary fails", () => {
    const result = resolveFypFallback({
      primaryUrl: "https://cdn.example.com/main.mp4",
      cdnFallbackUrl: "https://cdn.example.com/fallback.mp4",
      primaryHealthy: false,
      cdnFallbackHealthy: true
    });

    expect(result.tier).toBe("cdn_fallback");
  });

  it("uses embedded emergency fallback when all network video fails", () => {
    const result = resolveFypFallback({
      primaryUrl: "",
      cdnFallbackUrl: "",
      primaryHealthy: false,
      cdnFallbackHealthy: false
    });

    expect(result.tier).toBe("embedded_emergency");
    expect(result.playbackUrl.startsWith("data:video/mp4")).toBe(true);
  });

  it("triggers fallback exhaustion alert after repeated failures", () => {
    expect(
      shouldTriggerFallbackExhaustionAlert({
        failures: 5,
        windowSeconds: 60
      })
    ).toBe(true);
  });
});
