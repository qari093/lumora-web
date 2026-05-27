import type { MediaAsset } from "../media-runtime/types";

export type PreloadPlan = {
  assetId: string;
  preloadNext: boolean;
  maxBufferSeconds: number;
  bandwidthProtected: boolean;
};

export function createPreloadPlan(input: {
  asset: MediaAsset;
  networkMbps: number;
}): PreloadPlan {
  const preloadNext =
    input.asset.bitrateKbps / 1000 < input.networkMbps * 0.8;

  return {
    assetId: input.asset.assetId,
    preloadNext,
    maxBufferSeconds: preloadNext ? 12 : 4,
    bandwidthProtected: true
  };
}
