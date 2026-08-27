import type { ExtractedTeaserMetadata } from "./teaserMetadataExtraction";
import { buildMetadataOnlyFallbackCard } from "./metadataOnlyFallbackEngine";

export type MetadataOnlyDowngradeInput = {
  metadata: ExtractedTeaserMetadata;
  reason:
    | "blocked_media"
    | "missing_media"
    | "removed_media"
    | "degraded_source"
    ;
  triggeredBy:
    | "rights"
    | "culture"
    | "availability"
    | "ops";
};

export type MetadataOnlyDowngradeResult = {
  downgraded: true;
  card: ReturnType<typeof buildMetadataOnlyFallbackCard>;
  reason: MetadataOnlyDowngradeInput["reason"];
  triggeredBy: MetadataOnlyDowngradeInput["triggeredBy"];
};

export function applyMetadataOnlyDowngrade(
  input: MetadataOnlyDowngradeInput
): MetadataOnlyDowngradeResult {
  return {
    downgraded: true,
    card: buildMetadataOnlyFallbackCard(input.metadata, input.reason),
    reason: input.reason,
    triggeredBy: input.triggeredBy,
  };
}

export function shouldDowngradeToMetadataOnly(
  reason: MetadataOnlyDowngradeInput["reason"]
): boolean {
  return (
    reason === "blocked_media" ||
    reason === "missing_media" ||
    reason === "removed_media" ||
    reason === "degraded_source" ||
    reason === "manual_review"
  );
}
