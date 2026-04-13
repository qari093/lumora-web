import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import type { MetadataOnlyCardSchema } from "./metadataCardSchema";

export function canUsePosterOnlyFallback(
  metadata: ExtractedTeaserMetadata
): boolean {
  return Boolean(metadata.posterUrl && metadata.posterUrl.trim().length > 0);
}

export function buildPosterOnlyFallbackCard(
  metadata: ExtractedTeaserMetadata
): MetadataOnlyCardSchema {
  return {
    id: `poster-only:${metadata.category}:${metadata.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    type: "metadata",
    title: metadata.title,
    subtitle: `${metadata.sourceName} • Poster Fallback`,
    description: "Poster-only fallback used to preserve teaser discovery continuity.",
    category: metadata.category === "cross-media" ? "movie" : metadata.category,
    posterUrl: metadata.posterUrl,
    sourceName: metadata.sourceName,
    sourceUrl: metadata.canonicalUrl || metadata.teaserUrl,
    releaseDate: metadata.releasedAt,
    language: metadata.language,
    region: metadata.region,
    trustScore: metadata.rightsHint === "safe" ? 88 : 55,
    fallbackReason: "missing_media",
  };
}
