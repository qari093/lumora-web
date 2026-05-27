export type PlaybackStatus =
  | "idle"
  | "buffering"
  | "playing"
  | "paused"
  | "ended"
  | "error";

export interface PlaybackState {
  itemId: string;
  status: PlaybackStatus;
  positionMs: number;
  durationMs: number;
  muted: boolean;
}

export interface PlaybackProgress {
  itemId: string;
  progress: number;
  complete: boolean;
}
