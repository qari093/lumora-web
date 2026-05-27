import type {
  NativeVideoAsset,
  NativeVideoRuntimeState
} from "../types";

import { validateNativeVideoAsset } from "../contracts/nativeVideoContract";

export function evaluateNativeVideo(
  asset: NativeVideoAsset
): NativeVideoRuntimeState {
  if (!validateNativeVideoAsset(asset)) {
    throw new Error("invalid_native_video_asset");
  }

  if (!asset.hasAudio) {
    return {
      assetId: asset.id,
      state: "error",
      canPlay: false,
      reason: "audio_required"
    };
  }

  return {
    assetId: asset.id,
    state: "ready",
    canPlay: true,
    reason: "native_video_ready"
  };
}
