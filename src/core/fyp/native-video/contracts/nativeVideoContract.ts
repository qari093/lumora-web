import type { NativeVideoAsset } from "../types";

export function validateNativeVideoAsset(
  asset: NativeVideoAsset
): boolean {
  return Boolean(
    asset.id &&
      asset.src &&
      asset.poster &&
      Number.isFinite(asset.durationMs) &&
      asset.durationMs > 0 &&
      typeof asset.hasAudio === "boolean"
  );
}
