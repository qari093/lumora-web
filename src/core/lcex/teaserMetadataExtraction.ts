import type { TeaserIngestionInput } from "./teaserIngestionContract";

export type ExtractedTeaserMetadata = {
  title: string;
  sourceName: string;
  category: TeaserIngestionInput["category"];
  canonicalUrl?: string;
  teaserUrl?: string;
  posterUrl?: string;
  language: string;
  region: string;
  releasedAt?: string;
  rightsHint: "safe" | "unknown" | "restricted";
  extractedAt: string;
};

export function extractTeaserMetadata(
  input: TeaserIngestionInput
): ExtractedTeaserMetadata {
  return {
    title: input.title.trim(),
    sourceName: input.sourceName.trim(),
    category: input.category,
    canonicalUrl: input.canonicalUrl?.trim() || undefined,
    teaserUrl: input.teaserUrl?.trim() || undefined,
    posterUrl: input.posterUrl?.trim() || undefined,
    language: input.language?.trim().toLowerCase() || "en",
    region: input.region?.trim().toLowerCase() || "global",
    releasedAt: input.releasedAt?.trim() || undefined,
    rightsHint: input.rightsHint ?? "unknown",
    extractedAt: input.ingestedAt,
  };
}

export function hasUsableTeaserMetadata(
  metadata: ExtractedTeaserMetadata
): boolean {
  return (
    metadata.title.length > 0 &&
    metadata.sourceName.length > 0 &&
    metadata.language.length > 0 &&
    metadata.region.length > 0
  );
}
