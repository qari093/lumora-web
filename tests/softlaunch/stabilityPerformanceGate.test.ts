import { describe, expect, it } from "vitest";
import { evaluateStabilityPerformanceGate } from "@/lib/softlaunch/stabilityPerformanceGate";

describe("soft-launch stability + performance gate", () => {
  it("passes healthy metrics", () => {
    const out = evaluateStabilityPerformanceGate({
      avgTTFBMs: 220,
      errorRatePct: 0.2,
      cacheHitRate: 0.72,
      healthPassRate: 0.995,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.gate.passed).toBe(true);
    }
  });

  it("fails weak metrics", () => {
    const out = evaluateStabilityPerformanceGate({
      avgTTFBMs: 600,
      errorRatePct: 2.5,
      cacheHitRate: 0.2,
      healthPassRate: 0.8,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.gate.passed).toBe(false);
    }
  });

  it("rejects invalid cache hit rate", () => {
    const out = evaluateStabilityPerformanceGate({
      avgTTFBMs: 200,
      errorRatePct: 0.1,
      cacheHitRate: 2,
      healthPassRate: 0.99,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_cache_hit_rate" });
  });

  it("rejects invalid health pass rate", () => {
    const out = evaluateStabilityPerformanceGate({
      avgTTFBMs: 200,
      errorRatePct: 0.1,
      cacheHitRate: 0.8,
      healthPassRate: -1,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_health_pass_rate" });
  });
});
