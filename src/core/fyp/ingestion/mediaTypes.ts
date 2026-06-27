export interface RawMediaAsset {
  id: string;
  source: string;
  url: string;
  mimeType: string;
  durationSeconds: number;
}

export interface NormalizedMediaAsset {
  id: string;
  source: string;
  playbackUrl: string;
  format: "mp4";
  durationSeconds: number;
  aspectRatio: "9:16" | "16:9" | "1:1";
  verified: boolean;
}
