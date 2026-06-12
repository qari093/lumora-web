import { describe, expect, it } from "vitest";

import {
  applyTraceAwareFeedRerank,
  validateFypTraceAwareRerankColdStart
} from "@/src/core/fyp/runtime-learning/traceAwareRerank";

describe("FYP Mega Pack 06 — Trace-Aware Rerank + Cold Start Safety", () => {
  it("applies trace-aware rerank", () => {
    const result = applyTraceAwareFeedRerank();

    expect(result.cards.length).toBeGreaterThan(0);
    expect(result.cards[0]?.rankReasons).toContain("trace_aware_rerank");
  });

  it("applies cold-start safety when confidence is low", () => {
    const result = applyTraceAwareFeedRerank();

    expect(result.coldStartApplied).toBe(true);
    expect(result.cards.every((card) => card.rankReasons.includes("cold_start_safety"))).toBe(true);
  });

  it("keeps reranked cards sorted and bounded", () => {
    const result = applyTraceAwareFeedRerank();

    expect(
      result.cards.every((card, index, list) =>
        card.rankScore >= 0 &&
        card.rankScore <= 1 &&
        (index === 0 || list[index - 1].rankScore >= card.rankScore)
      )
    ).toBe(true);
  });

  it("validates complete trace-aware rerank cold-start runtime", () => {
    expect(validateFypTraceAwareRerankColdStart()).toBe(true);
  });
});
