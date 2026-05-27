import type { Fyp94ContentSource } from "../core/policy";
import type { Fyp94LicenseType } from "../supply/licenseRegistry";

export type Fyp94ProcessedAsset = {
  assetId: string;
  source: Fyp94ContentSource;
  licenseType: Fyp94LicenseType;
  title: string;
  mp4Url: string;
  posterUrl: string;
  width: number;
  height: number;
  durationSeconds: number;
  mimeType: "video/mp4";
  aspectRatio: "vertical" | "square" | "horizontal";
  storedAt: string;
};
