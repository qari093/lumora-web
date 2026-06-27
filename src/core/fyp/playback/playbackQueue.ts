import type { FypPlaybackAsset } from "./playbackTypes";
import { evaluatePlaybackReadiness } from "./playbackReadiness";

export function buildPlayableQueue(
  assets: FypPlaybackAsset[]
): FypPlaybackAsset[] {
  return assets.filter(asset => evaluatePlaybackReadiness(asset).playable);
}
