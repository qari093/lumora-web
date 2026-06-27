import type { RawMediaAsset } from "./mediaTypes";

export function removeDuplicateAssets(
  assets: RawMediaAsset[]
): RawMediaAsset[] {

  const seen = new Set<string>();

  return assets.filter(asset => {
    if (seen.has(asset.id)) {
      return false;
    }

    seen.add(asset.id);
    return true;
  });
}
