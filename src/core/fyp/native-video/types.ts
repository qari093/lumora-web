export type NativeVideoState =
  | "idle"
  | "preloading"
  | "ready"
  | "playing"
  | "error";

export interface NativeVideoAsset {
  id: string;
  src: string;
  poster: string;
  durationMs: number;
  hasAudio: boolean;
}

export interface NativeVideoRuntimeState {
  assetId: string;
  state: NativeVideoState;
  canPlay: boolean;
  reason: string;
}
