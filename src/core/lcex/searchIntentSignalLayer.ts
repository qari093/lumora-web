import type { PreViralSignal } from "./preViralSignalRegistry";

export type SearchIntentSample = {
  entityId: string;
  query: string;
  category: PreViralSignal["category"];
  source: string;
  searchVolumeDelta: number;
  repeatQueryRate: number;
  detectedAt: string;
  region?: string;
  language?: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreSearchIntentSample(sample: SearchIntentSample): number {
  const volumeScore = clampScore(sample.searchVolumeDelta);
  const repeatScore = clampScore(sample.repeatQueryRate);
  return clampScore(volumeScore * 0.65 + repeatScore * 0.35);
}

export function buildSearchIntentSignal(
  sample: SearchIntentSample
): PreViralSignal {
  const score = scoreSearchIntentSample(sample);

  return {
    id: `search-intent:${sample.entityId}:${sample.detectedAt}`,
    type: "search-intent",
    entityId: sample.entityId,
    category: sample.category,
    source: sample.source,
    score,
    confidence: clampScore(score * 0.9),
    detectedAt: sample.detectedAt,
    region: sample.region,
    language: sample.language,
    metadata: {
      query: sample.query,
      searchVolumeDelta: sample.searchVolumeDelta,
      repeatQueryRate: sample.repeatQueryRate,
    },
  };
}

export function isStrongSearchIntentSignal(sample: SearchIntentSample): boolean {
  return scoreSearchIntentSample(sample) >= 70;
}
