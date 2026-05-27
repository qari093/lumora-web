import type { MediaAsset } from "../types";

export function createMediaAsset(type: MediaAsset["type"]): MediaAsset {
  return {
    id: `media_${type}`,
    type,
    quality: "hd",
    optimized: true
  };
}
