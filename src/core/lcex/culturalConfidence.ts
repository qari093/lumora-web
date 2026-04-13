export const CULTURAL_CONFIDENCE_LEVELS = [
  "low",
  "medium",
  "high",
  "restricted",
] as const;

export type CulturalConfidence = typeof CULTURAL_CONFIDENCE_LEVELS[number];

export function isCulturalConfidence(value: string): value is CulturalConfidence {
  return CULTURAL_CONFIDENCE_LEVELS.includes(value as CulturalConfidence);
}

export function assertCulturalConfidence(
  value: string
): asserts value is CulturalConfidence {
  if (!isCulturalConfidence(value)) {
    throw new Error(`Invalid cultural confidence: ${value}`);
  }
}

export const CULTURAL_CONFIDENCE_SCORE: Record<CulturalConfidence, number> = {
  low: 25,
  medium: 60,
  high: 90,
  restricted: 0,
};
