import type {
  FypPlaybackAsset,
  FypPlaybackReadiness
} from "./playbackTypes";

export function evaluatePlaybackReadiness(
  asset: FypPlaybackAsset
): FypPlaybackReadiness {
  if (!asset.playbackUrl) {
    return { playable: false, reason: "missing_url" };
  }

  if (!asset.playbackUrl.endsWith(".mp4") && asset.mimeType !== "video/mp4") {
    return { playable: false, reason: "unsupported_format" };
  }

  if (asset.durationSeconds <= 0 || asset.durationSeconds > 90) {
    return { playable: false, reason: "invalid_duration" };
  }

  if (!asset.verified) {
    return { playable: false, reason: "unverified" };
  }

  return { playable: true, reason: "ready" };
}
