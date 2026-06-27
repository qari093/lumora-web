import type { FypEnrichedMetadata } from "./metadataTypes";

export function passesMetadataGate(
  metadata: FypEnrichedMetadata
): boolean {
  return (
    Boolean(metadata.id) &&
    Boolean(metadata.title) &&
    Boolean(metadata.playbackUrl) &&
    Boolean(metadata.attribution) &&
    metadata.qualityScore >= 0.8
  );
}
