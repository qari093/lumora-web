import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import { buildMetadataOnlyFallbackCard } from "./metadataOnlyFallbackEngine";

export type RegionBlockDecision = {
  blocked: boolean;
  allowedRegions: string[];
  fallback:
    | ReturnType<typeof buildMetadataOnlyFallbackCard>
    | null;
};

function normalizeRegion(value: string): string {
  return value.trim().toLowerCase();
}

export function resolveRegionBlockFallback(
  metadata: ExtractedTeaserMetadata,
  viewerRegion: string,
  allowedRegions: string[]
): RegionBlockDecision {
  const normalizedViewerRegion = normalizeRegion(viewerRegion);
  const normalizedAllowedRegions = allowedRegions.map(normalizeRegion);

  if (
    normalizedAllowedRegions.length === 0 ||
    normalizedAllowedRegions.includes("global") ||
    normalizedAllowedRegions.includes(normalizedViewerRegion)
  ) {
    return {
      blocked: false,
      allowedRegions: normalizedAllowedRegions,
      fallback: null,
    };
  }

  return {
    blocked: true,
    allowedRegions: normalizedAllowedRegions,
    fallback: buildMetadataOnlyFallbackCard(metadata, "blocked_media"),
  };
}
