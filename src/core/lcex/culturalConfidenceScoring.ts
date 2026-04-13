import type { CulturalConfidence } from "./culturalConfidence";

export type CulturalConfidenceInput = {
  regionMatchScore: number;
  languageNuanceScore: number;
  sensitivityScore: number;
  sourceContextScore: number;
};

export type CulturalConfidenceBreakdown = {
  regionMatchScore: number;
  languageNuanceScore: number;
  sensitivityScore: number;
  sourceContextScore: number;
  totalScore: number;
  level: CulturalConfidence;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreCulturalConfidence(
  input: CulturalConfidenceInput
): CulturalConfidenceBreakdown {
  const regionMatchScore = clampScore(input.regionMatchScore);
  const languageNuanceScore = clampScore(input.languageNuanceScore);
  const sensitivityScore = clampScore(input.sensitivityScore);
  const sourceContextScore = clampScore(input.sourceContextScore);

  const totalScore = clampScore(
    regionMatchScore * 0.3 +
      languageNuanceScore * 0.3 +
      sensitivityScore * 0.2 +
      sourceContextScore * 0.2
  );

  const level: CulturalConfidence =
    totalScore >= 80
      ? "high"
      : totalScore >= 55
      ? "medium"
      : totalScore > 0
      ? "low"
      : "restricted";

  return {
    regionMatchScore,
    languageNuanceScore,
    sensitivityScore,
    sourceContextScore,
    totalScore,
    level,
  };
}

export function isCulturallySafeToPromote(
  input: CulturalConfidenceInput
): boolean {
  const result = scoreCulturalConfidence(input);
  return result.level === "high" || result.level === "medium";
}
