import type { RawMediaAsset } from "./mediaTypes";

export function validateMediaAsset(
  asset: RawMediaAsset
): boolean {

  if (!asset.id) return false;
  if (!asset.source) return false;
  if (!asset.url.startsWith("http")) return false;
  if (asset.durationSeconds <= 0) return false;

  return true;
}
