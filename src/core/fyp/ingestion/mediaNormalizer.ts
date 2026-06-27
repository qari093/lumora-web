import type {
  RawMediaAsset,
  NormalizedMediaAsset
} from "./mediaTypes";

export function normalizeMediaAsset(
  asset: RawMediaAsset
): NormalizedMediaAsset {

  return {
    id: asset.id,
    source: asset.source,
    playbackUrl: asset.url,
    format: "mp4",
    durationSeconds: asset.durationSeconds,
    aspectRatio: "9:16",
    verified: true
  };
}
