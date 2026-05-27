import type { MediaAsset } from "../media-runtime/types";

export type StreamingProfile = {
  assetId: string;
  ladder: ("360p" | "540p" | "720p" | "1080p")[];
  adaptive: boolean;
};

export function createStreamingProfile(
  asset: MediaAsset
): StreamingProfile {
  const ladder: StreamingProfile["ladder"] = ["360p"];

  if (asset.height >= 540) ladder.push("540p");
  if (asset.height >= 720) ladder.push("720p");
  if (asset.height >= 1080) ladder.push("1080p");

  return {
    assetId: asset.assetId,
    ladder,
    adaptive: ladder.length > 1
  };
}
