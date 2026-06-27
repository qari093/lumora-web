export interface FypPlaybackAsset {
  id: string;
  playbackUrl: string;
  mimeType: string;
  durationSeconds: number;
  verified: boolean;
}

export interface FypPlaybackReadiness {
  playable: boolean;
  reason: "ready" | "missing_url" | "unsupported_format" | "invalid_duration" | "unverified";
}
