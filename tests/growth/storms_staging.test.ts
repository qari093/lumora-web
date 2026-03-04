import { describe, it, expect } from "vitest";
import { assessStorm, guardsForStormLevel, DEFAULT_STORM_CONFIG } from "@/lib/growth/storms";

describe("storms (growth shock staging)", () => {
  it("does not auto-escalate above operator confirmed level", () => {
    const s = {
      uploadsLastHour: DEFAULT_STORM_CONFIG.level3Uploads + 10,
      viewsLastHour: 0,
      p95EdgeMs: 10,
      errorRate: 0,
      queueDepth: 0,
    };
    const a0 = assessStorm(s, DEFAULT_STORM_CONFIG, 0);
    expect(a0.computedLevel).toBe(3);
    expect(a0.activeLevel).toBe(0);
    expect(a0.needsOperatorConfirm).toBe(true);

    const a1 = assessStorm(s, DEFAULT_STORM_CONFIG, 1);
    expect(a1.activeLevel).toBe(1);
    expect(a1.needsOperatorConfirm).toBe(true);

    const a3 = assessStorm(s, DEFAULT_STORM_CONFIG, 3);
    expect(a3.activeLevel).toBe(3);
    expect(a3.needsOperatorConfirm).toBe(false);
  });

  it("performance breaches trigger at least level 1 computed", () => {
    const s = {
      uploadsLastHour: 0,
      viewsLastHour: 0,
      p95EdgeMs: DEFAULT_STORM_CONFIG.maxP95EdgeMs + 1,
      errorRate: 0,
      queueDepth: 0,
    };
    const a = assessStorm(s, DEFAULT_STORM_CONFIG, 0);
    expect(a.computedLevel).toBe(1);
    expect(a.activeLevel).toBe(0);
    expect(a.needsOperatorConfirm).toBe(true);
    expect(a.reasons).toContain("p95_edge_ms_high");
  });

  it("guards tighten with level", () => {
    const g0 = guardsForStormLevel(0);
    const g2 = guardsForStormLevel(2);
    expect(g0.allowExpensiveJobs).toBe(true);
    expect(g2.allowExpensiveJobs).toBe(false);
    expect(g2.maxEncodeConcurrency).toBeLessThan(g0.maxEncodeConcurrency);
    expect(g2.maxVariantCount).toBeLessThan(g0.maxVariantCount);
    expect(g2.segmentUrlMaxTtlSec).toBeLessThan(g0.segmentUrlMaxTtlSec);
  });
});
