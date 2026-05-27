import type { MediaAsset, StreamSession, MediaRuntime } from "../types";

export function validateMediaAsset(asset: MediaAsset): boolean {
  return Boolean(asset.id && asset.type && asset.quality);
}

export function validateStreamSession(session: StreamSession): boolean {
  return Boolean(session.id && session.bitrate > 0);
}

export function validateMediaRuntime(runtime: MediaRuntime): boolean {
  return Boolean(runtime.active === true && runtime.assets.every(validateMediaAsset));
}
