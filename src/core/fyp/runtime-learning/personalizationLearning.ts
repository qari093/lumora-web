import {
  buildFypRuntimeRanking,
  type FypRuntimeRankedCard
} from "@/src/core/fyp/runtime-ranking/rankingRuntime";

import {
  buildFypRuntimeTrackingBatch,
  type FypRuntimeTrackingEvent
} from "@/src/core/fyp/runtime-tracking/fypRuntimeTracking";

import {
  getFypLearningEventsWithFallback
} from "@/src/core/fyp/runtime-learning/realEventLearningBridge";

export type FypPersonalizationMemory = {
  userId: string;
  preferredTraceLanes: Record<string, number>;
  preferredSources: Record<string, number>;
  lastUpdatedAt: string;
  confidence: number;
};

export type FypLearningFeedback = {
  userId: string;
  memory: FypPersonalizationMemory;
  ranked: FypRuntimeRankedCard[];
  appliedSignals: number;
};

function bump(map: Record<string, number>, key: string, value: number): Record<string, number> {
  return {
    ...map,
    [key]: Math.max(0, Math.min(Number(((map[key] ?? 0) + value).toFixed(4)), 1))
  };
}

export function buildFypPersonalizationMemory(
  userId = "local-user",
  events: FypRuntimeTrackingEvent[] = getFypLearningEventsWithFallback(buildFypRuntimeTrackingBatch())
): FypPersonalizationMemory {
  const ranked = buildFypRuntimeRanking();
  let preferredTraceLanes: Record<string, number> = {};
  let preferredSources: Record<string, number> = {};

  for (const event of events) {
    const card = ranked.find((item) => item.id === event.cardId);

    const traceLane =
      card?.traceLane ||
      event.traceLane ||
      "wonder";

    const sourceId =
      card?.sourceId ||
      event.sourceId ||
      event.cardId;

    const signal =
      event.type === "skip"
        ? -0.12
        : event.value * 0.18;

    preferredTraceLanes = bump(
      preferredTraceLanes,
      traceLane,
      signal
    );

    preferredSources = bump(
      preferredSources,
      sourceId,
      signal
    );
  }

  const confidence = Math.max(0, Math.min(Number((events.length / 10).toFixed(4)), 1));

  return {
    userId,
    preferredTraceLanes,
    preferredSources,
    lastUpdatedAt: new Date(0).toISOString(),
    confidence
  };
}

export function applyFypLearningFeedback(
  userId = "local-user",
  events: FypRuntimeTrackingEvent[] = getFypLearningEventsWithFallback(buildFypRuntimeTrackingBatch())
): FypLearningFeedback {
  const memory = buildFypPersonalizationMemory(userId, events);

  const ranked = buildFypRuntimeRanking()
    .map((card) => {
      const traceBoost = memory.preferredTraceLanes[card.traceLane] ?? 0;
      const sourceBoost = memory.preferredSources[card.sourceId] ?? 0;

      return {
        ...card,
        rankScore: Math.max(
          0,
          Math.min(Number((card.rankScore + traceBoost * 0.2 + sourceBoost * 0.25).toFixed(4)), 1)
        ),
        rankReasons: Array.from(new Set([
          ...card.rankReasons,
          "personalization_memory",
          "learning_feedback"
        ]))
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore);

  return {
    userId,
    memory,
    ranked,
    appliedSignals: events.length
  };
}

export function validateFypPersonalizationLearningRuntime(): boolean {
  const feedback = applyFypLearningFeedback();

  return (
    feedback.userId === "local-user" &&
    feedback.appliedSignals >= 3 &&
    feedback.memory.confidence > 0 &&
    feedback.ranked.length > 0 &&
    feedback.ranked.every((card, index, list) =>
      card.rankScore >= 0 &&
      card.rankScore <= 1 &&
      card.rankReasons.includes("personalization_memory") &&
      card.rankReasons.includes("learning_feedback") &&
      (index === 0 || list[index - 1].rankScore >= card.rankScore)
    )
  );
}
