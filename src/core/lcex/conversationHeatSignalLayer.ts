import type { PreViralSignal } from "./preViralSignalRegistry";

export type ConversationHeatSample = {
  entityId: string;
  category: PreViralSignal["category"];
  source: string;
  mentionVelocity: number;
  uniqueAuthorRate: number;
  repostRate: number;
  detectedAt: string;
  region?: string;
  language?: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreConversationHeatSample(
  sample: ConversationHeatSample
): number {
  const velocityScore = clampScore(sample.mentionVelocity);
  const uniquenessScore = clampScore(sample.uniqueAuthorRate);
  const repostPenalty = clampScore(sample.repostRate) * 0.2;

  return clampScore(
    velocityScore * 0.5 +
      uniquenessScore * 0.5 -
      repostPenalty
  );
}

export function buildConversationHeatSignal(
  sample: ConversationHeatSample
): PreViralSignal {
  const score = scoreConversationHeatSample(sample);

  return {
    id: `conversation-heat:${sample.entityId}:${sample.detectedAt}`,
    type: "conversation-heat",
    entityId: sample.entityId,
    category: sample.category,
    source: sample.source,
    score,
    confidence: clampScore(score * 0.88),
    detectedAt: sample.detectedAt,
    region: sample.region,
    language: sample.language,
    metadata: {
      mentionVelocity: sample.mentionVelocity,
      uniqueAuthorRate: sample.uniqueAuthorRate,
      repostRate: sample.repostRate,
    },
  };
}

export function isStrongConversationHeatSignal(
  sample: ConversationHeatSample
): boolean {
  return scoreConversationHeatSample(sample) >= 68;
}
