import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";

export type WatchlistCtaCard = {
  id: string;
  type: "cta";
  title: string;
  subtitle: string;
  description: string;
  category: "movie" | "series" | "music" | "gaming";
  ctaLabel: "Add to Watchlist" | "Track Release" | "Follow Hype";
  sourceName: string;
  sourceUrl?: string;
  releaseDate?: string;
  language: string;
  region: string;
};

export function buildWatchlistCtaFallbackCard(
  metadata: ExtractedTeaserMetadata
): WatchlistCtaCard {
  const normalizedCategory =
    metadata.category === "cross-media" ? "movie" : metadata.category;

  return {
    id: `watchlist-cta:${normalizedCategory}:${metadata.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    type: "cta",
    title: metadata.title,
    subtitle: `${metadata.sourceName} • Save for updates`,
    description:
      "CTA fallback used when media-safe discovery is unavailable but user intent should be preserved.",
    category: normalizedCategory,
    ctaLabel:
      normalizedCategory === "music" ? "Follow Hype" : "Add to Watchlist",
    sourceName: metadata.sourceName,
    sourceUrl: metadata.canonicalUrl || metadata.teaserUrl,
    releaseDate: metadata.releasedAt,
    language: metadata.language,
    region: metadata.region,
  };
}

export function shouldUseWatchlistCtaFallback(
  metadata: ExtractedTeaserMetadata
): boolean {
  return metadata.title.trim().length > 0 && metadata.sourceName.trim().length > 0;
}
