import type {
  AudioAsset,
  AudioDecision
} from "../types";

import {
  validateAudioAsset
} from "../contracts/audioContract";

const SUPPORTED_CODECS = [
  "aac",
  "mp3",
  "opus"
];

export function evaluateAudioAsset(
  asset: AudioAsset
): AudioDecision {
  if (!validateAudioAsset(asset)) {
    throw new Error("invalid_audio_asset");
  }

  if (!SUPPORTED_CODECS.includes(asset.codec)) {
    return {
      id: asset.id,
      usable: false,
      reason: "unsupported_codec",
      normalizeRequired: false
    };
  }

  return {
    id: asset.id,
    usable: true,
    reason: "audio_ready",
    normalizeRequired: !asset.normalized
  };
}
