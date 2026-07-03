import type { ShareAnalyticsEvent, ShareQualityMetrics } from "./types";

function clamp(value: number): number {
  return Number(Math.max(0, Math.min(1, value)).toFixed(4));
}

export function calculateShareQuality(params: {
  shareId: string;
  events: ShareAnalyticsEvent[];
  relationshipScore: number;
  portalFit: number;
  moodMatch: number;
}): ShareQualityMetrics {
  const echoDepth = params.events.some((event) => event.kind === "echo_played") ? 0.18 : 0;
  const memoryDepth = params.events.some((event) => event.kind === "memory_planted") ? 0.2 : 0;
  const conversationDepth = params.events.some((event) => event.kind === "conversation_started") ? 0.16 : 0;

  const emotionalDepth = clamp(0.32 + echoDepth + memoryDepth + conversationDepth + params.moodMatch * 0.18);
  const relationshipFit = clamp(params.relationshipScore);
  const portalFit = clamp(params.portalFit);
  const creatorValue = clamp(params.events.filter((event) => event.kind === "reshared" || event.kind === "saved").length * 0.12 + 0.42);
  const serenityScore = clamp(1 - Math.max(0, params.events.length - 8) * 0.04);
  const overallQuality = clamp(
    emotionalDepth * 0.28 +
      relationshipFit * 0.22 +
      portalFit * 0.2 +
      creatorValue * 0.16 +
      serenityScore * 0.14,
  );

  return {
    shareId: params.shareId,
    emotionalDepth,
    relationshipFit,
    portalFit,
    creatorValue,
    serenityScore,
    overallQuality,
  };
}
