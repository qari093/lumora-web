import type { PreViralSignal } from "./preViralSignalRegistry";

export type FandomIgnitionSample = {
  entityId: string;
  category: PreViralSignal["category"];
  source: string;
  fanArtRate: number;
  theoryPostRate: number;
  reactionClipRate: number;
  detectedAt: string;
  region?: string;
  language?: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreFandomIgnitionSample(
  sample: FandomIgnitionSample
): number {
  const fanArtScore = clampScore(sample.fanArtRate);
  const theoryScore = clampScore(sample.theoryPostRate);
  const reactionScore = clampScore(sample.reactionClipRate);

  return clampScore(
    fanArtScore * 0.35 +
      theoryScore * 0.4 +
      reactionScore * 0.25
  );
}

export function buildFandomIgnitionSignal(
  sample: FandomIgnitionSample
): PreViralSignal {
  const score = scoreFandomIgnitionSample(sample);

  return {
    id: `fandom-ignition:${sample.entityId}:${sample.detectedAt}`,
    type: "fandom-ignition",
    entityId: sample.entityId,
    category: sample.category,
    source: sample.source,
    score,
    confidence: clampScore(score * 0.9),
    detectedAt: sample.detectedAt,
    region: sample.region,
    language: sample.language,
    metadata: {
      fanArtRate: sample.fanArtRate,
      theoryPostRate: sample.theoryPostRate,
      reactionClipRate: sample.reactionClipRate,
    },
  };
}

export function isStrongFandomIgnitionSignal(
  sample: FandomIgnitionSample
): boolean {
  return scoreFandomIgnitionSample(sample) >= 70;
}
