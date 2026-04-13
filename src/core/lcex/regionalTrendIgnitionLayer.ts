import type { PreViralSignal } from "./preViralSignalRegistry";

export type RegionalTrendIgnitionSample = {
  entityId: string;
  category: PreViralSignal["category"];
  source: string;
  region: string;
  localVelocity: number;
  crossCitySpread: number;
  localCreatorRate: number;
  detectedAt: string;
  language?: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreRegionalTrendIgnitionSample(
  sample: RegionalTrendIgnitionSample
): number {
  return clampScore(
    sample.localVelocity * 0.45 +
      sample.crossCitySpread * 0.3 +
      sample.localCreatorRate * 0.25
  );
}

export function buildRegionalTrendIgnitionSignal(
  sample: RegionalTrendIgnitionSample
): PreViralSignal {
  const score = scoreRegionalTrendIgnitionSample(sample);

  return {
    id: `regional-ignition:${sample.entityId}:${sample.region}:${sample.detectedAt}`,
    type: "regional-ignition",
    entityId: sample.entityId,
    category: sample.category,
    source: sample.source,
    score,
    confidence: clampScore(score * 0.88),
    detectedAt: sample.detectedAt,
    region: sample.region,
    language: sample.language,
    metadata: {
      localVelocity: sample.localVelocity,
      crossCitySpread: sample.crossCitySpread,
      localCreatorRate: sample.localCreatorRate,
    },
  };
}

export function isStrongRegionalTrendIgnitionSignal(
  sample: RegionalTrendIgnitionSample
): boolean {
  return scoreRegionalTrendIgnitionSample(sample) >= 68;
}
