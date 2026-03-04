import { describe, it, expect } from "vitest";
import { decideViralThrottle } from "@/lib/video/edge/viralThrottle";

describe("viral throttle (auto viral throttle with expiry knobs)", () => {
  it("stays off under low velocity", () => {
    const d = decideViralThrottle({ viewsPerMin: 100, cacheHitRatio: 0.9, egressBudgetUsed: 0.2, operatorMaxLevel: 3 });
    expect(d.ok).toBe(true);
    if (d.ok) {
      expect(d.appliedLevel).toBe(0);
      expect(d.hotLevel).toBe(0);
      expect(d.segmentTtlSec).toBe(60);
    }
  });

  it("does not exceed operator confirmed max level", () => {
    const d = decideViralThrottle({ viewsPerMin: 25000, cacheHitRatio: 0.9, egressBudgetUsed: 0.2, operatorMaxLevel: 1 });
    expect(d.ok).toBe(true);
    if (d.ok) {
      expect(d.computedLevel).toBe(3);
      expect(d.appliedLevel).toBe(1);
      expect(d.reasons.includes("operator_cap_applied")).toBe(true);
    }
  });

  it("bumps severity when cache hit is low", () => {
    const d = decideViralThrottle({ viewsPerMin: 1200, cacheHitRatio: 0.4, egressBudgetUsed: 0.2, operatorMaxLevel: 3 });
    expect(d.ok).toBe(true);
    if (d.ok) {
      expect(d.computedLevel).toBeGreaterThanOrEqual(2);
      expect(d.reasons.includes("low_cache_hit_bump")).toBe(true);
    }
  });

  it("bumps severity when egress is critical", () => {
    const d = decideViralThrottle({ viewsPerMin: 1200, cacheHitRatio: 0.9, egressBudgetUsed: 0.96, operatorMaxLevel: 3 });
    expect(d.ok).toBe(true);
    if (d.ok) {
      expect(d.computedLevel).toBeGreaterThanOrEqual(3);
      expect(d.reasons.includes("egress_critical_bump")).toBe(true);
    }
  });

  it("forces emergency computed level on high error ratio, but still respects operator cap", () => {
    const d = decideViralThrottle({ viewsPerMin: 1200, cacheHitRatio: 0.9, egressBudgetUsed: 0.2, operatorMaxLevel: 2, errorRatio: 0.2 });
    expect(d.ok).toBe(true);
    if (d.ok) {
      expect(d.computedLevel).toBe(3);
      expect(d.appliedLevel).toBe(2);
      expect(d.hotLevel).toBe(2);
      expect(d.segmentTtlSec).toBe(30);
    }
  });
});
