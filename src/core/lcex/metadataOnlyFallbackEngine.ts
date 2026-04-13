import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import type { MetadataOnlyCardSchema } from "./metadataCardSchema";

export type MetadataFallbackReason = MetadataOnlyCardSchema["fallbackReason"];

export function buildMetadataOnlyFallbackCard(
  metadata: ExtractedTeaserMetadata,
  reason: MetadataFallbackReason
): MetadataOnlyCardSchema {
  return {
    id: `metadata-fallback:${metadata.category}:${metadata.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    type: "metadata",
    title: metadata.title,
    subtitle: metadata.sourceName,
    description:
      metadata.canonicalUrl ||
      metadata.teaserUrl ||
      "Metadata-safe fallback card for discovery continuity.",
    category: metadata.category === "cross-media" ? "movie" : metadata.category,
    posterUrl: metadata.posterUrl,
    sourceName: metadata.sourceName,
    sourceUrl: metadata.canonicalUrl || metadata.teaserUrl,
    releaseDate: metadata.releasedAt,
    language: metadata.language,
    region: metadata.region,
    trustScore: metadata.rightsHint === "safe" ? 90 : metadata.rightsHint === "unknown" ? 60 : 20,
    fallbackReason: reason,
  };
}

export function shouldUseMetadataOnlyFallback(
  metadata: ExtractedTeaserMetadata
): boolean {
  return (
    metadata.rightsHint !== "safe" ||
    (!metadata.teaserUrl && !metadata.posterUrl)
  );
}
