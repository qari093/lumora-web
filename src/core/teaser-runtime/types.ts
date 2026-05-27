export type TeaserPlatform = "tiktok" | "reels" | "shorts" | "x" | "discord";

export interface TeaserAsset {
  id: string;
  sourceId: string;
  platform: TeaserPlatform;
  durationSeconds: number;
}
