import { describe, expect, it } from "vitest";

import { buildFypRuntimeApiFeed } from "@/src/core/fyp/runtime-api/feedApiBridge";
import { buildRealFeedCards } from "@/src/core/fyp/runtime-adapter/realFeedAdapter";
import { buildFypRuntimeUiState } from "@/src/core/fyp/runtime-ui/fypRuntimeUi";
import { buildFypRuntimeTrackingBatch } from "@/src/core/fyp/runtime-tracking/fypRuntimeTracking";
import { buildFypRuntimeRanking } from "@/src/core/fyp/runtime-ranking/rankingRuntime";
import { applyFypLearningFeedback } from "@/src/core/fyp/runtime-learning/personalizationLearning";
import { applyTraceAwareFeedRerank } from "@/src/core/fyp/runtime-learning/traceAwareRerank";

describe("FYP Mega Pack 07 — Runtime Chain Verification", () => {
  it("verifies feed API to real adapter to UI chain", () => {
    const api = buildFypRuntimeApiFeed();
    const cards = buildRealFeedCards();
    const ui = buildFypRuntimeUiState();

    expect(api.ok).toBe(true);
    expect(api.items.length).toBeGreaterThan(0);
    expect(cards.length).toBe(api.items.length);
    expect(ui.ready).toBe(true);
    expect(ui.activeCard?.id).toBe(cards[0]?.id);
  });

  it("verifies tracking journey from active UI card", () => {
    const ui = buildFypRuntimeUiState();
    const tracking = buildFypRuntimeTrackingBatch();

    expect(ui.activeCard).not.toBeNull();
    expect(tracking.length).toBeGreaterThan(0);
    expect(tracking.every((event) => event.cardId === ui.activeCard?.id)).toBe(true);
  });

  it("verifies ranking and learning journey", () => {
    const ranked = buildFypRuntimeRanking();
    const learned = applyFypLearningFeedback();
    const reranked = applyTraceAwareFeedRerank();

    expect(ranked.length).toBeGreaterThan(0);
    expect(learned.ranked.length).toBe(ranked.length);
    expect(reranked.cards.length).toBe(ranked.length);
    expect(reranked.cards[0]?.rankReasons).toContain("trace_aware_rerank");
  });

  it("keeps final reranked feed production-safe", () => {
    const result = applyTraceAwareFeedRerank();

    expect(result.cards.every((card) =>
      Boolean(card.id) &&
      Boolean(card.playbackUrl) &&
      card.rankScore >= 0 &&
      card.rankScore <= 1 &&
      card.autoplayEligible === true
    )).toBe(true);
  });
});
