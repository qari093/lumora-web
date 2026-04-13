import type { PreViralSignal } from "./preViralSignalRegistry";

export type EntitySpikeSample = {
  entityId: string;
  entityRole: "actor" | "director" | "artist" | "creator";
  category: PreViralSignal["category"];
  source: string;
  mentionDelta: number;
  searchDelta: number;
  crossProjectDelta: number;
  detectedAt: string;
  region?: string;
  language?: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreEntitySpikeSample(
  sample: EntitySpikeSample
): number {
  return clampScore(
    sample.mentionDelta * 0.4 +
      sample.searchDelta * 0.35 +
      sample.crossProjectDelta * 0.25
  );
}

export function buildEntitySpikeSignal(
  sample: EntitySpikeSample
): PreViralSignal {
  const score = scoreEntitySpikeSample(sample);

  return {
    id: `entity-spike:${sample.entityId}:${sample.detectedAt}`,
    type: "entity-spike",
    entityId: sample.entityId,
    category: sample.category,
    source: sample.source,
    score,
    confidence: clampScore(score * 0.89),
    detectedAt: sample.detectedAt,
    region: sample.region,
    language: sample.language,
    metadata: {
      entityRole: sample.entityRole,
      mentionDelta: sample.mentionDelta,
      searchDelta: sample.searchDelta,
      crossProjectDelta: sample.crossProjectDelta,
    },
  };
}

export function isStrongEntitySpikeSignal(
  sample: EntitySpikeSample
): boolean {
  return scoreEntitySpikeSample(sample) >= 70;
}
