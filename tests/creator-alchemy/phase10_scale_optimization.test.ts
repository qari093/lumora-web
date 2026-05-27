import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  buildFailoverPlan,
  buildOptimizedCachePolicy,
  optimizeCreatorAlchemyScale,
  scheduleDreamChamberUnderLoad
} from "@/src/core/creator-alchemy/scale-optimization";

describe("Phase 10 — Scale + Infrastructure Optimization Ω", () => {
  it("keeps normal mode under healthy load", () => {
    const decision = optimizeCreatorAlchemyScale({
      batchLoad: 0.4,
      replayEventsPerMinute: 800,
      creatorSnapshotCount: 1000,
      constellationClusterLoad: 0.4,
      cacheHitRatio: 0.82,
      queueDepth: 20,
      runtimeCostPressure: 0.3
    });

    expect(decision.batchMode).toBe("normal");
    expect(decision.replayAggregationMode).toBe("live");
    expect(decision.cacheMode).toBe("normal");
    expect(decision.costSafe).toBe(true);
  });

  it("switches to defensive modes under pressure", () => {
    const decision = optimizeCreatorAlchemyScale({
      batchLoad: 0.95,
      replayEventsPerMinute: 6000,
      creatorSnapshotCount: 10000,
      constellationClusterLoad: 0.9,
      cacheHitRatio: 0.4,
      queueDepth: 600,
      runtimeCostPressure: 0.95
    });

    expect(decision.batchMode).toBe("throttled");
    expect(decision.replayAggregationMode).toBe("batched");
    expect(decision.cacheMode).toBe("aggressive");
    expect(decision.shouldFailover).toBe(true);
  });

  it("delays Dream Chamber under load instead of dropping it", () => {
    const decision = scheduleDreamChamberUnderLoad({
      resonance: 0.8,
      currentLoad: 0.9,
      queueDepth: 50
    });

    expect(decision.allowed).toBe(true);
    expect(decision.delayMinutes).toBe(30);
  });

  it("builds optimized cache policies", () => {
    const policy = buildOptimizedCachePolicy({
      feature: "dashboard",
      cacheHitRatio: 0.4
    });

    expect(policy.mode).toBe("aggressive");
    expect(policy.ttlSeconds).toBeGreaterThan(60);
  });

  it("builds failover plan", () => {
    const plan = buildFailoverPlan({
      shouldFailover: true,
      runtimeCostPressure: 0.95
    });

    expect(plan.active).toBe(true);
    expect(plan.disableMythic).toBe(true);
    expect(plan.batchWhispers).toBe(true);
  });

  it("creates scale optimization API route", () => {
    expect(existsSync("app/api/creator-alchemy/scale-optimization/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/scale-optimization/route.ts", "utf8")).toContain("optimizeCreatorAlchemyScale");
  });
});
