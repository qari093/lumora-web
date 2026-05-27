import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  buildContentPulseSnapshot,
  calculatePulseHealth,
  recommendSelfHealingActions,
  shouldDemoteContent,
  shouldThrottleUploads,
  validateContentPulseSnapshot,
} from "@/src/content-engine/pulse";

const healthyMetrics = {
  ingestionQueueDepth: 0,
  processingLatencyP95Ms: 1000,
  safetyPassRate: 0.95,
  feedPoolSize: 100,
  freshPoolSize: 50,
  globalSkipRate: 0.2,
  cdnCacheHitRatio: 0.85,
  estimatedCostPer1000Displays: 0.1,
};

describe("Content Engine Pack11 — Content Pulse Dashboard + Self-Healing", () => {
  it("builds healthy pulse snapshot", () => {
    const snapshot = buildContentPulseSnapshot(healthyMetrics);

    expect(snapshot.health).toBe("healthy");
    expect(snapshot.actions[0].action).toBe("none");
    expect(validateContentPulseSnapshot(snapshot).ok).toBe(true);
  });

  it("detects critical pulse health", () => {
    expect(calculatePulseHealth({
      ...healthyMetrics,
      processingLatencyP95Ms: 70000,
    })).toBe("critical");

    expect(calculatePulseHealth({
      ...healthyMetrics,
      feedPoolSize: 5,
    })).toBe("critical");
  });

  it("recommends self-healing actions", () => {
    const actions = recommendSelfHealingActions({
      ...healthyMetrics,
      processingLatencyP95Ms: 70000,
      globalSkipRate: 0.7,
      estimatedCostPer1000Displays: 0.7,
    });

    expect(actions.map((a) => a.action)).toContain("throttle_uploads");
    expect(actions.map((a) => a.action)).toContain("increase_exploration");
    expect(actions.map((a) => a.action)).toContain("cold_storage_sweep");
  });

  it("demotes broken or reported content", () => {
    expect(shouldDemoteContent({ rollingSkipRate: 0.7, reportCount: 0 }).demote).toBe(true);
    expect(shouldDemoteContent({ rollingSkipRate: 0.1, reportCount: 3 }).reason).toBe("multi_user_reports");
    expect(shouldDemoteContent({ rollingSkipRate: 0.1, reportCount: 0 }).demote).toBe(false);
  });

  it("throttles uploads under pressure and exposes pulse API route", () => {
    expect(shouldThrottleUploads({ processingLatencyP95Ms: 70000, queueDepth: 1 }).throttle).toBe(true);
    expect(shouldThrottleUploads({ processingLatencyP95Ms: 1000, queueDepth: 101 }).retryAfterSec).toBe(120);
    expect(fs.existsSync("app/api/content-engine/pulse/route.ts")).toBe(true);
  });
});
