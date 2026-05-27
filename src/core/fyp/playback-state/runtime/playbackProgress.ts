import type {
  PlaybackProgress,
  PlaybackState
} from "../types";

import {
  validatePlaybackState
} from "../contracts/playbackStateContract";

export function calculatePlaybackProgress(
  state: PlaybackState
): PlaybackProgress {
  if (!validatePlaybackState(state)) {
    throw new Error("invalid_playback_state");
  }

  const progress =
    state.durationMs === 0
      ? 0
      : state.positionMs / state.durationMs;

  return {
    itemId: state.itemId,
    progress,
    complete:
      state.status === "ended" ||
      progress >= 0.95
  };
}
