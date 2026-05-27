import { describe, expect, it } from "vitest";
import { createMobilePerformanceProfile, mobilePerformanceHealthy } from "../../../src/core/gmar/mobile-performance/runtime";
import { resolveGmarVisualMode } from "../../../src/core/gmar/mobile-performance/adaptiveMode";
import { hapticPolicyHealthy } from "../../../src/core/gmar/mobile-performance/haptics";

describe("GMAR Pack 33/40 — Mobile Performance Runtime", () => {
  it("validates normal and low-end profiles", () => {
    expect(mobilePerformanceHealthy(createMobilePerformanceProfile(false))).toBe(true);
    expect(mobilePerformanceHealthy(createMobilePerformanceProfile(true))).toBe(true);
  });

  it("resolves Lo-Fi Soul under constrained device conditions", () => {
    expect(resolveGmarVisualMode({ memoryGb: 3, batteryPercent: 80, reducedMotion: false })).toBe("lofi-soul");
    expect(resolveGmarVisualMode({ memoryGb: 8, batteryPercent: 10, reducedMotion: false })).toBe("lofi-soul");
    expect(resolveGmarVisualMode({ memoryGb: 8, batteryPercent: 90, reducedMotion: false })).toBe("full-holographic");
  });

  it("validates haptic policy", () => {
    const policy = hapticPolicyHealthy();
    expect(policy.intensityCapped).toBe(true);
    expect(policy.userControllable).toBe(true);
  });
});
