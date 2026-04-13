import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import type { MetadataOnlyCardSchema } from "./metadataCardSchema";

export function canUseTitleReleaseFallback(
  metadata: ExtractedTeaserMetadata
): boolean {
  return metadata.title.trim().length > 0;
}

export function buildTitleReleaseFallbackCard(
  metadata: ExtractedTeaserMetadata
): MetadataOnlyCardSchema {
  const subtitleParts = [metadata.sourceName];
  if (metadata.releasedAt) subtitleParts.push(`Release: ${metadata.releasedAt}`);

  return {
    id: `title-release:${metadata.category}:${metadata.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    type: "metadata",
    title: metadata.title,
    subtitle: subtitleParts.join(" • "),
    description:
      "Title-and-release fallback used when teaser media and poster-safe rendering are unavailable.",
    category: metadata.category === "cross-media" ? "movie" : metadata.category,
    posterUrl: undefined,
    sourceName: metadata.sourceName,
    sourceUrl: metadata.canonicalUrl || metadata.teaserUrl,
    releaseDate: metadata.releasedAt,
    language: metadata.language,
    region: metadata.region,
    trustScore: metadata.rightsHint === "safe" ? 82 : 50,
    fallbackReason: "missing_media",
  };
}
