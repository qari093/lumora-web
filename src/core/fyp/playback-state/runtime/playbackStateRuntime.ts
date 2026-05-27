import type {
  PlaybackProgress,
  PlaybackState
} from "../types";

import {
  calculatePlaybackProgress
} from "./playbackProgress";

export function runPlaybackStateRuntime(
  states: PlaybackState[]
): PlaybackProgress[] {
  return states.map(calculatePlaybackProgress);
}
