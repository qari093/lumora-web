import type { AudioAsset } from "../types";

export function validateAudioAsset(
  asset: AudioAsset
): boolean {
  return Boolean(
    asset.id &&
      asset.src &&
      Number.isFinite(asset.durationMs) &&
      asset.durationMs > 0 &&
      asset.codec &&
      typeof asset.normalized === "boolean"
  );
}
