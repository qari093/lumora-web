import type {
  MediaAsset,
  MediaPlaybackState
} from "../media-runtime/types";

import {
  validateMediaAsset
} from "../media-runtime/mediaValidation";

export function createFeedPlaybackState(input: {
  asset: MediaAsset;
  userMutedDefault?: boolean;
}): MediaPlaybackState {
  const decision = validateMediaAsset(input.asset);

  return {
    assetId: input.asset.assetId,
    autoplay: decision.playable,
    muted: input.userMutedDefault ?? true,
    preload: decision.playable ? "metadata" : "none",
    safeForFeed: decision.playable
  };
}
