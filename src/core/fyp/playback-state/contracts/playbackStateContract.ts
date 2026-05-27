import type {
  PlaybackState,
  PlaybackStatus
} from "../types";

const VALID_STATUS: PlaybackStatus[] = [
  "idle",
  "buffering",
  "playing",
  "paused",
  "ended",
  "error"
];

export function isPlaybackStatus(
  value: string
): value is PlaybackStatus {
  return VALID_STATUS.includes(value as PlaybackStatus);
}

export function validatePlaybackState(
  state: PlaybackState
): boolean {
  return Boolean(
    state.itemId &&
      isPlaybackStatus(state.status) &&
      Number.isFinite(state.positionMs) &&
      Number.isFinite(state.durationMs) &&
      state.positionMs >= 0 &&
      state.durationMs > 0 &&
      state.positionMs <= state.durationMs &&
      typeof state.muted === "boolean"
  );
}
