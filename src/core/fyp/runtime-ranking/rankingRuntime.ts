import {
  buildFypRuntimeUiState
} from "@/src/core/fyp/runtime-ui/fypRuntimeUi";

import {
  buildFypRuntimeTrackingBatch,
  type FypRuntimeTrackingEvent
} from "@/src/core/fyp/runtime-tracking/fypRuntimeTracking";

import type {
  RealFypFeedCard
} from "@/src/core/fyp/runtime-adapter/realFeedAdapter";

export type FypRuntimeRankedCard = RealFypFeedCard & {
  rankScore: number;
  rankReasons: string[];
  trackingScore: number;
};

const EVENT_WEIGHTS: Record<FypRuntimeTrackingEvent["type"], number> = {
  impression: 0.08,
  view: 0.18,
  watch_progress: 0.34,
  like: 0.55,
  save: 0.72,
  share: 0.8,
  skip: -0.35
};

export function scoreFypTrackingSignals(events: FypRuntimeTrackingEvent[]): number {
  const score = events.reduce((sum, event) => {
    const weight = EVENT_WEIGHTS[event.type] ?? 0;
    return sum + weight * event.value;
  }, 0);

  return Math.max(0, Math.min(Number(score.toFixed(4)), 1));
}

export function rankFypRuntimeCard(
  card: RealFypFeedCard,
  events: FypRuntimeTrackingEvent[] = []
): FypRuntimeRankedCard {
  const cardEvents = events.filter((event) => event.cardId === card.id);
  const trackingScore = scoreFypTrackingSignals(cardEvents);
  const laneBoost = card.lane === "native_video" ? 0.1 : 0.06;
  const traceBoost = card.traceLane === "wonder" || card.traceLane === "explore" ? 0.08 : 0.04;
  const seedScore = Math.max(0, Math.min(card.rankingSeed / 9999, 1)) * 0.2;

  const rankScore = Math.max(
    0,
    Math.min(Number((trackingScore + laneBoost + traceBoost + seedScore).toFixed(4)), 1)
  );

  return {
    ...card,
    rankScore,
    trackingScore,
    rankReasons: [
      "tracking_signals",
      card.lane === "native_video" ? "native_video_ready" : "official_embed_ready",
      "trace_lane_alignment"
    ]
  };
}

export function buildFypRuntimeRanking(): FypRuntimeRankedCard[] {
  const state = buildFypRuntimeUiState();
  const events = buildFypRuntimeTrackingBatch();

  return [...state.cards]
    .map((card) => rankFypRuntimeCard(card, events))
    .sort((a, b) => b.rankScore - a.rankScore);
}

export function validateFypRuntimeRankingContract(): boolean {
  const ranked = buildFypRuntimeRanking();

  return (
    ranked.length > 0 &&
    ranked.every((card) =>
      Boolean(card.id) &&
      card.rankScore >= 0 &&
      card.rankScore <= 1 &&
      card.trackingScore >= 0 &&
      card.trackingScore <= 1 &&
      card.rankReasons.includes("tracking_signals")
    ) &&
    ranked.every((card, index, list) => index === 0 || list[index - 1].rankScore >= card.rankScore)
  );
}
