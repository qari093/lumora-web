import { describe, expect, it } from "vitest";
import {
  cachePolicyForFeature,
  createOfflineEmotionalSnapshot,
  decideCostGovernor,
  decideFeatureRateLimit,
  mythicThrottleAllowed,
  prioritizeBatchJobs,
  renderNonLlmInsight,
  selectBatchJobsWithinBudget
} from "@/src/core/creator-alchemy/infra";

describe("Creator Alchemy Pack 11 — Scalability & Infrastructure Ω", () => {
  it("prioritizes batch jobs by priority and cost", () => {
    const jobs = prioritizeBatchJobs([
      { id: "a", feature: "whisper", tier: "batch", priority: 2, estimatedCostUnits: 10 },
      { id: "b", feature: "dashboard", tier: "edge", priority: 5, estimatedCostUnits: 5 },
      { id: "c", feature: "mythic", tier: "deferred", priority: 5, estimatedCostUnits: 2 }
    ]);

    expect(jobs.map((job) => job.id)).toEqual(["c", "b", "a"]);
  });

  it("selects batch jobs within budget", () => {
    const jobs = selectBatchJobsWithinBudget([
      { id: "a", feature: "whisper", tier: "batch", priority: 5, estimatedCostUnits: 7 },
      { id: "b", feature: "dashboard", tier: "edge", priority: 4, estimatedCostUnits: 5 },
      { id: "c", feature: "mythic", tier: "deferred", priority: 3, estimatedCostUnits: 10 }
    ], 12);

    expect(jobs.map((job) => job.id)).toEqual(["a", "b"]);
  });

  it("allows within-budget features and defers mythic work when needed", () => {
    expect(decideCostGovernor({
      dailyBudgetUnits: 100,
      usedUnits: 20,
      requestedUnits: 10,
      feature: "dashboard"
    }).tier).toBe("edge");

    const mythic = decideCostGovernor({
      dailyBudgetUnits: 100,
      usedUnits: 95,
      requestedUnits: 20,
      feature: "mythic"
    });

    expect(mythic.allowed).toBe(false);
    expect(mythic.reason).toBe("mythic_deferred_for_budget");
  });

  it("rate limits emotional features", () => {
    expect(decideFeatureRateLimit({ feature: "whisper", eventsThisWindow: 2, windowLimit: 3 }).allowed).toBe(true);
    expect(decideFeatureRateLimit({ feature: "whisper", eventsThisWindow: 3, windowLimit: 3 }).allowed).toBe(false);
  });

  it("throttles mythic features by days", () => {
    expect(mythicThrottleAllowed(100, 180)).toBe(false);
    expect(mythicThrottleAllowed(180, 180)).toBe(true);
  });

  it("provides feature cache policies", () => {
    expect(cachePolicyForFeature("dashboard", "creator:1").ttlSeconds).toBe(60);
    expect(cachePolicyForFeature("mythic", "creator:1").ttlSeconds).toBe(86400);
  });

  it("renders non-LLM insight templates", () => {
    expect(renderNonLlmInsight({ signal: "rewatch", moment: "0:42" })).toContain("0:42");
    expect(renderNonLlmInsight({ signal: "save" })).toContain("saved");
  });

  it("creates offline emotional snapshots", () => {
    const snapshot = createOfflineEmotionalSnapshot({
      creatorId: "creator-1",
      capturedAt: "2026-01-01T00:00:00.000Z",
      dashboardStateKey: "dash:creator-1",
      safeToShowOffline: true
    });

    expect(snapshot.safeToShowOffline).toBe(true);
  });
});
