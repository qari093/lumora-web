import {
  applyFypLearningFeedback
} from "@/src/core/fyp/runtime-learning/personalizationLearning";

import type {
  FypRuntimeRankedCard
} from "@/src/core/fyp/runtime-ranking/rankingRuntime";

export type FypTraceAwareRerankResult = {
  cards: FypRuntimeRankedCard[];
  coldStartApplied: boolean;
  traceCoverage: string[];
};

const DEFAULT_TRACE_ORDER = ["wonder", "explore", "learn", "build", "laugh"];

export function applyTraceAwareFeedRerank(): FypTraceAwareRerankResult {
  const feedback = applyFypLearningFeedback();
  const seenTrace = new Set<string>();

  const reranked = [...feedback.ranked]
    .map((card) => {
      const traceBoost = DEFAULT_TRACE_ORDER.includes(card.traceLane) ? 0.04 : 0.01;

      return {
        ...card,
        rankScore: Math.max(0, Math.min(Number((card.rankScore + traceBoost).toFixed(4)), 1)),
        rankReasons: Array.from(new Set([...card.rankReasons, "trace_aware_rerank"]))
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore);

  const diversified = reranked.sort((a, b) => {
    const aSeen = seenTrace.has(a.traceLane) ? 1 : 0;
    const bSeen = seenTrace.has(b.traceLane) ? 1 : 0;

    if (aSeen !== bSeen) return aSeen - bSeen;
    return b.rankScore - a.rankScore;
  });

  for (const card of diversified) seenTrace.add(card.traceLane);

  const coldStartApplied = feedback.memory.confidence < 0.5;

  const coldStartCards = coldStartApplied
    ? diversified.map((card, index) => ({
        ...card,
        rankScore: Math.max(0, Math.min(Number((card.rankScore + (index === 0 ? 0.03 : 0.01)).toFixed(4)), 1)),
        rankReasons: Array.from(new Set([...card.rankReasons, "cold_start_safety"]))
      }))
    : diversified;

  return {
    cards: coldStartCards.sort((a, b) => b.rankScore - a.rankScore),
    coldStartApplied,
    traceCoverage: Array.from(new Set(coldStartCards.map((card) => card.traceLane)))
  };
}

export function validateFypTraceAwareRerankColdStart(): boolean {
  const result = applyTraceAwareFeedRerank();

  return (
    result.cards.length > 0 &&
    result.coldStartApplied === true &&
    result.traceCoverage.length > 0 &&
    result.cards.every((card, index, list) =>
      card.rankScore >= 0 &&
      card.rankScore <= 1 &&
      card.rankReasons.includes("trace_aware_rerank") &&
      card.rankReasons.includes("cold_start_safety") &&
      (index === 0 || list[index - 1].rankScore >= card.rankScore)
    )
  );
}
