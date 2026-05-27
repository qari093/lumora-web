export type MediaRuntimeKind =
  | "video"
  | "audio"
  | "teaser"
  | "thumbnail";

export type MediaAsset = {
  assetId: string;
  kind: MediaRuntimeKind;
  url: string;
  durationSeconds: number;
  hasAudio: boolean;
  width: number;
  height: number;
  bitrateKbps: number;
  signed: boolean;
};

export type MediaRuntimeDecision = {
  assetId: string;
  playable: boolean;
  reason: string;
  preferredQuality: "low" | "medium" | "high";
};

export type MediaPlaybackState = {
  assetId: string;
  autoplay: boolean;
  muted: boolean;
  preload: "none" | "metadata" | "auto";
  safeForFeed: boolean;
};
