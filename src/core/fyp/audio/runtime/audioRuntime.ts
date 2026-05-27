import type {
  AudioAsset,
  AudioDecision
} from "../types";

import {
  evaluateAudioAsset
} from "./audioPolicy";

export function runAudioRuntime(
  assets: AudioAsset[]
): AudioDecision[] {
  return assets.map(evaluateAudioAsset);
}
