import { describe, expect, it } from "vitest";

import {
  buildFypRuntimeRanking,
  rankFypRuntimeCard,
  scoreFypTrackingSignals,
  validateFypRuntimeRankingContract
} from "@/src/core/fyp/runtime-ranking/rankingRuntime";

import {
  buildFypRuntimeTrackingBatch
} from "@/src/core/fyp/runtime-tracking/fypRuntimeTracking";

import {
  buildFypRuntimeUiState
} from "@/src/core/fyp/runtime-ui/fypRuntimeUi";

describe("FYP Mega Pack 06 — Runtime Ranking Contract", () => {
  it("scores tracking signals safely", () => {
    const score = scoreFypTrackingSignals(buildFypRuntimeTrackingBatch());

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it("ranks a runtime card with rank reasons", () => {
    const state = buildFypRuntimeUiState();
    const ranked = rankFypRuntimeCard(state.activeCard!, buildFypRuntimeTrackingBatch());

    expect(ranked.rankScore).toBeGreaterThan(0);
    expect(ranked.rankScore).toBeLessThanOrEqual(1);
    expect(ranked.rankReasons).toContain("tracking_signals");
  });

  it("builds sorted runtime ranking", () => {
    const ranked = buildFypRuntimeRanking();

    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked.every((card, index, list) => index === 0 || list[index - 1].rankScore >= card.rankScore)).toBe(true);
  });

  it("validates complete runtime ranking contract", () => {
    expect(validateFypRuntimeRankingContract()).toBe(true);
  });
});
