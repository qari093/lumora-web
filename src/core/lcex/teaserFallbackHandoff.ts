import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import { canUsePosterOnlyFallback, buildPosterOnlyFallbackCard } from "./posterOnlyTeaserFallback";
import { canUseTitleReleaseFallback, buildTitleReleaseFallbackCard } from "./titleReleaseCardFallback";
import { buildWatchlistCtaFallbackCard } from "./watchlistCtaFallback";

export type TeaserFallbackHandoffResult =
  | {
      kind: "poster-only";
      card: ReturnType<typeof buildPosterOnlyFallbackCard>;
    }
  | {
      kind: "title-release";
      card: ReturnType<typeof buildTitleReleaseFallbackCard>;
    }
  | {
      kind: "watchlist-cta";
      card: ReturnType<typeof buildWatchlistCtaFallbackCard>;
    };

export function resolveTeaserFallbackHandoff(
  metadata: ExtractedTeaserMetadata
): TeaserFallbackHandoffResult {
  if (canUsePosterOnlyFallback(metadata)) {
    return {
      kind: "poster-only",
      card: buildPosterOnlyFallbackCard(metadata),
    };
  }

  if (canUseTitleReleaseFallback(metadata)) {
    return {
      kind: "title-release",
      card: buildTitleReleaseFallbackCard(metadata),
    };
  }

  return {
    kind: "watchlist-cta",
    card: buildWatchlistCtaFallbackCard(metadata),
  };
}
