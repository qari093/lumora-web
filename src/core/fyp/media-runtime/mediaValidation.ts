import type {
  MediaAsset,
  MediaRuntimeDecision
} from "./types";

export function validateMediaAsset(
  asset: MediaAsset
): MediaRuntimeDecision {
  if (!asset.assetId.trim() || !asset.url.trim()) {
    throw new Error("Media asset requires assetId and url.");
  }

  if (asset.kind === "video" && !asset.hasAudio) {
    return {
      assetId: asset.assetId,
      playable: false,
      reason: "video_requires_audio_track",
      preferredQuality: "low"
    };
  }

  if (!asset.signed) {
    return {
      assetId: asset.assetId,
      playable: false,
      reason: "signed_url_required",
      preferredQuality: "low"
    };
  }

  return {
    assetId: asset.assetId,
    playable: true,
    reason: "playable",
    preferredQuality:
      asset.bitrateKbps >= 2500
        ? "high"
        : asset.bitrateKbps >= 1000
          ? "medium"
          : "low"
  };
}
