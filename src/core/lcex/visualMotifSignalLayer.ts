import type { PreViralSignal } from "./preViralSignalRegistry";

export type VisualMotifSample = {
  entityId: string;
  category: PreViralSignal["category"];
  source: string;
  motifLabel: string;
  recurrenceRate: number;
  crossSourcePresence: number;
  detectedAt: string;
  region?: string;
  language?: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreVisualMotifSample(
  sample: VisualMotifSample
): number {
  const recurrenceScore = clampScore(sample.recurrenceRate);
  const crossSourceScore = clampScore(sample.crossSourcePresence * 10);
  return clampScore(recurrenceScore * 0.65 + crossSourceScore * 0.35);
}

export function buildVisualMotifSignal(
  sample: VisualMotifSample
): PreViralSignal {
  const score = scoreVisualMotifSample(sample);

  return {
    id: `visual-motif:${sample.entityId}:${sample.detectedAt}`,
    type: "visual-motif",
    entityId: sample.entityId,
    category: sample.category,
    source: sample.source,
    score,
    confidence: clampScore(score * 0.88),
    detectedAt: sample.detectedAt,
    region: sample.region,
    language: sample.language,
    metadata: {
      motifLabel: sample.motifLabel,
      recurrenceRate: sample.recurrenceRate,
      crossSourcePresence: sample.crossSourcePresence,
    },
  };
}

export function isStrongVisualMotifSignal(
  sample: VisualMotifSample
): boolean {
  return scoreVisualMotifSample(sample) >= 68;
}
