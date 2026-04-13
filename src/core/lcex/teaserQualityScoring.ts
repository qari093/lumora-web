import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";

export type TeaserQualityBreakdown = {
  titleScore: number;
  sourceScore: number;
  mediaScore: number;
  localeScore: number;
  rightsScore: number;
  freshnessScore: number;
  totalScore: number;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreFreshness(releasedAt?: string): number {
  if (!releasedAt) return 40;

  const released = Date.parse(releasedAt);
  if (Number.isNaN(released)) return 40;

  const ageDays = Math.max(0, (Date.now() - released) / (1000 * 60 * 60 * 24));

  if (ageDays <= 7) return 100;
  if (ageDays <= 30) return 85;
  if (ageDays <= 90) return 65;
  if (ageDays <= 180) return 45;
  return 25;
}

export function scoreTeaserQuality(
  metadata: ExtractedTeaserMetadata
): TeaserQualityBreakdown {
  const titleScore = metadata.title.trim().length >= 6 ? 100 : 55;
  const sourceScore = metadata.sourceName.trim().length >= 3 ? 100 : 50;

  const mediaSignals = [
    Boolean(metadata.teaserUrl),
    Boolean(metadata.posterUrl),
    Boolean(metadata.canonicalUrl),
  ].filter(Boolean).length;
  const mediaScore = mediaSignals === 3 ? 100 : mediaSignals === 2 ? 80 : mediaSignals === 1 ? 60 : 20;

  const localeScore =
    metadata.language !== "en" || metadata.region !== "global" ? 100 : 80;

  const rightsScore =
    metadata.rightsHint === "safe"
      ? 100
      : metadata.rightsHint === "unknown"
      ? 55
      : 10;

  const freshnessScore = scoreFreshness(metadata.releasedAt);

  const totalScore = clampScore(
    titleScore * 0.15 +
      sourceScore * 0.2 +
      mediaScore * 0.25 +
      localeScore * 0.1 +
      rightsScore * 0.15 +
      freshnessScore * 0.15
  );

  return {
    titleScore,
    sourceScore,
    mediaScore,
    localeScore,
    rightsScore,
    freshnessScore,
    totalScore,
  };
}

export function isHighQualityTeaser(
  metadata: ExtractedTeaserMetadata
): boolean {
  return scoreTeaserQuality(metadata).totalScore >= 75;
}
