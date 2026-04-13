import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import { buildMetadataOnlyFallbackCard } from "./metadataOnlyFallbackEngine";
import { buildDiscussionCtaFallbackCard } from "./discussionCtaFallback";

export type RemovedMediaFallbackResult = {
  removed: boolean;
  fallback:
    | ReturnType<typeof buildMetadataOnlyFallbackCard>
    | ReturnType<typeof buildDiscussionCtaFallbackCard>;
};

export function resolveRemovedMediaFallback(
  metadata: ExtractedTeaserMetadata,
  removed: boolean
): RemovedMediaFallbackResult {
  if (!removed) {
    return {
      removed: false,
      fallback: buildDiscussionCtaFallbackCard(metadata),
    };
  }

  return {
    removed: true,
    fallback: buildMetadataOnlyFallbackCard(metadata, "removed_media"),
  };
}
