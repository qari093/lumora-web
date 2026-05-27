import type { CineVerseFederatedVideo } from "./types";

export function canRenderFederatedVideo(video: CineVerseFederatedVideo) {
  return video.rightsVerified && !video.regionBlocked;
}

export function resolvePlaybackMode(video: CineVerseFederatedVideo) {
  if (!canRenderFederatedVideo(video)) return "unavailable";
  if (video.embeddable) return "embed";
  if (video.sourceType === "webtorrent_public_domain") return "webtorrent";
  return "deep-link";
}
