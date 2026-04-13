import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import { buildMetadataOnlyFallbackCard } from "./metadataOnlyFallbackEngine";
import { buildTitleReleaseFallbackCard } from "./titleReleaseCardFallback";

export type DegradedSourceFallbackResult = {
  degraded: boolean;
  fallback:
    | ReturnType<typeof buildMetadataOnlyFallbackCard>
    | ReturnType<typeof buildTitleReleaseFallbackCard>;
};

export function resolveDegradedSourceFallback(
  metadata: ExtractedTeaserMetadata,
  degraded: boolean
): DegradedSourceFallbackResult {
  if (!degraded) {
    return {
      degraded: false,
      fallback: buildTitleReleaseFallbackCard(metadata),
    };
  }

  return {
    degraded: true,
    fallback: buildMetadataOnlyFallbackCard(metadata, "degraded_source"),
  };
}
