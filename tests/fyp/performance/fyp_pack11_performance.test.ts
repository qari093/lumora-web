import { describe, it, expect } from "vitest";

import {
  FYP_PERFORMANCE_BUDGETS
} from "../../../src/core/fyp/performance/performanceBudgets";

import {
  evaluateFypPerformance
} from "../../../src/core/fyp/performance/performanceGate";

import {
  buildFypPreloadPlan
} from "../../../src/core/fyp/performance/preloadPolicy";

describe("FYP Omega Pack 11", () => {
  it("defines strict runtime budgets", () => {
    expect(FYP_PERFORMANCE_BUDGETS.timeToFirstFrameWifiMs).toBeLessThanOrEqual(500);
    expect(FYP_PERFORMANCE_BUDGETS.timeToFirstFrame3gMs).toBeLessThanOrEqual(1500);
    expect(FYP_PERFORMANCE_BUDGETS.playerMemoryMb).toBeLessThanOrEqual(120);
  });

  it("passes healthy runtime sample", () => {
    const result = evaluateFypPerformance({
      timeToFirstFrameMs: 420,
      network: "wifi",
      memoryMb: 90,
      cpuPercent: 34,
      background: false,
      preloadSeconds: 10,
      preloadItems: 1
    });

    expect(result.ok).toBe(true);
    expect(result.failures.length).toBe(0);
  });

  it("fails slow 3g startup", () => {
    const result = evaluateFypPerformance({
      timeToFirstFrameMs: 2500,
      network: "3g",
      memoryMb: 90,
      cpuPercent: 30,
      background: false,
      preloadSeconds: 10,
      preloadItems: 1
    });

    expect(result.ok).toBe(false);
    expect(result.failures).toContain("ttff_budget_exceeded");
  });

  it("preloads metadata and first segment only", () => {
    const plan = buildFypPreloadPlan();

    expect(plan.nextItems).toBe(1);
    expect(plan.secondsPerItem).toBe(10);
    expect(plan.fullVideoPreload).toBe(false);
  });
});
