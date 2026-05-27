import { describe, expect, it } from "vitest";

import {
  getSoftDissonanceModes,
  isSoftDissonanceAllowed
} from "@/src/core/fyp/chaos/softDissonance";

import {
  calculateChaosBudget
} from "@/src/core/fyp/chaos/chaosBudget";

import {
  createDiscoveryEdgeResult
} from "@/src/core/fyp/discovery/discoveryEdge";

import {
  evaluateNoveltyFatigue
} from "@/src/core/fyp/discovery/noveltyFatigue";

import {
  createAnomalyLane
} from "@/src/core/fyp/discovery/anomalyLane";

describe("Lumora FYP Discovery Edge + Controlled Chaos", () => {
  const candidates = [
    { id: "a", creatorId: "c1", mode: "drift" as const, intensity: 5, replayWeight: 3, novelty: 80, createdAt: 1 },
    { id: "b", creatorId: "c2", mode: "deep" as const, intensity: 6, replayWeight: 4, novelty: 70, createdAt: 2 },
    { id: "c", creatorId: "c3", mode: "chaos" as const, intensity: 10, replayWeight: 8, novelty: 95, createdAt: 3 },
    { id: "d", creatorId: "c4", mode: "comfort" as const, intensity: 3, replayWeight: 5, novelty: 30, createdAt: 4 }
  ];

  it("returns soft dissonance modes", () => {
    expect(getSoftDissonanceModes("drift")).toContain("deep");
    expect(isSoftDissonanceAllowed({ from: "comfort", to: "drift" })).toBe(true);
  });

  it("calculates chaos budget for edge mode", () => {
    const budget = calculateChaosBudget({
      currentIntensity: 5,
      noveltyTolerance: 50,
      intent: "edge_mode"
    });

    expect(budget.chaosAllowed).toBe(true);
    expect(budget.noveltyBudget).toBe(80);
  });

  it("creates discovery edge result with protected chaos", () => {
    const result = createDiscoveryEdgeResult({
      request: {
        userId: "waqar",
        currentMode: "drift",
        intent: "unexpected",
        currentIntensity: 5,
        noveltyTolerance: 60
      },
      candidates,
      now: 100
    });

    expect(result.requestId).toBe("edge_waqar_100");
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.some(item => item.mode === "chaos")).toBe(false);
  });

  it("evaluates novelty fatigue", () => {
    const state = evaluateNoveltyFatigue({
      userId: "waqar",
      recentNoveltyScores: [80, 85, 90]
    });

    expect(state.fatigueRisk).toBe(true);
    expect(state.recommendation).toBe("cooldown");
  });

  it("creates opt-in anomaly lane", () => {
    const lane = createAnomalyLane({
      laneId: "edge_lane",
      items: candidates
    });

    expect(lane.protected).toBe(true);
    expect(lane.optInRequired).toBe(true);
    expect(lane.items.every(item => item.novelty >= 60)).toBe(true);
  });
});
