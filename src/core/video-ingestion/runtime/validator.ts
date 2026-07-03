import type { CanonicalVideoAsset } from "./types";

export type VideoValidationResult = {
  ok: boolean;
  errors: string[];
};

export function validateCanonicalVideoAsset(
  asset: CanonicalVideoAsset,
): VideoValidationResult {
  const errors: string[] = [];

  if (asset.version !== "uvip.v1") errors.push("invalid_version");
  if (!asset.providerId) errors.push("missing_provider");
  if (!asset.sourceAssetId) errors.push("missing_source_asset");
  if (!asset.sourceUrl.startsWith("https://") && !asset.sourceUrl.startsWith("lumora://"))
    errors.push("unsafe_source_url");
  if (!asset.title.trim()) errors.push("missing_title");
  if (asset.durationSeconds <= 0) errors.push("invalid_duration");
  if (asset.width < 320 || asset.height < 180) errors.push("resolution_too_low");
  if (!asset.hasAudio) errors.push("audio_required");
  if (!asset.mimeType.startsWith("video/")) errors.push("invalid_mime_type");
  if (!asset.license.sourceUrl) errors.push("missing_license_source");
  if (!asset.attribution.trim()) errors.push("missing_attribution");
  if (!asset.checksum) errors.push("missing_checksum");

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertCanonicalVideoAsset(asset: CanonicalVideoAsset) {
  const validation = validateCanonicalVideoAsset(asset);

  if (!validation.ok) {
    throw new Error(
      `invalid_canonical_video_asset:${validation.errors.join(",")}`,
    );
  }

  return asset;
}
