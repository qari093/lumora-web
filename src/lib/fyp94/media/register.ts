import type { Fyp94ProcessedAsset } from "./types";
import { detectFyp94AspectRatio, validateFyp94AspectRatio, validateFyp94Duration, validateFyp94Mime } from "./validate";
import { buildFyp94PosterUrl } from "./poster";

export function registerFyp94ProcessedAsset(input: {
  assetId: string;
  source: Fyp94ProcessedAsset["source"];
  licenseType: Fyp94ProcessedAsset["licenseType"];
  title: string;
  mp4Url: string;
  width: number;
  height: number;
  durationSeconds: number;
  mimeType: string;
}): Fyp94ProcessedAsset {
  if (!validateFyp94Mime(input.mimeType)) throw new Error("invalid_mime");
  if (!validateFyp94Duration(input.durationSeconds)) throw new Error("invalid_duration");
  if (!validateFyp94AspectRatio(input.width, input.height)) throw new Error("invalid_aspect_ratio");

  return {
    assetId: input.assetId,
    source: input.source,
    licenseType: input.licenseType,
    title: input.title,
    mp4Url: input.mp4Url,
    posterUrl: buildFyp94PosterUrl(input.assetId),
    width: input.width,
    height: input.height,
    durationSeconds: input.durationSeconds,
    mimeType: "video/mp4",
    aspectRatio: detectFyp94AspectRatio(input.width, input.height),
    storedAt: new Date().toISOString(),
  };
}
