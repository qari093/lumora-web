import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";

export type DiscussionCtaCard = {
  id: string;
  type: "cta";
  title: string;
  subtitle: string;
  description: string;
  category: "movie" | "series" | "music" | "gaming";
  ctaLabel: "Join Discussion" | "Share Take" | "Discuss Hype";
  sourceName: string;
  sourceUrl?: string;
  releaseDate?: string;
  language: string;
  region: string;
};

export function buildDiscussionCtaFallbackCard(
  metadata: ExtractedTeaserMetadata
): DiscussionCtaCard {
  const normalizedCategory =
    metadata.category === "cross-media" ? "movie" : metadata.category;

  return {
    id: `discussion-cta:${normalizedCategory}:${metadata.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    type: "cta",
    title: metadata.title,
    subtitle: `${metadata.sourceName} • Join the conversation`,
    description:
      "Discussion CTA fallback used when media-safe presentation is unavailable but conversational intent should continue.",
    category: normalizedCategory,
    ctaLabel:
      normalizedCategory === "music" ? "Discuss Hype" : "Join Discussion",
    sourceName: metadata.sourceName,
    sourceUrl: metadata.canonicalUrl || metadata.teaserUrl,
    releaseDate: metadata.releasedAt,
    language: metadata.language,
    region: metadata.region,
  };
}

export function shouldUseDiscussionCtaFallback(
  metadata: ExtractedTeaserMetadata
): boolean {
  return metadata.title.trim().length > 0 && metadata.sourceName.trim().length > 0;
}
