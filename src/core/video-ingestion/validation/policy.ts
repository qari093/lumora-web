import type { MediaValidationPolicy } from "./types";

export function createDefaultMediaValidationPolicy(
  overrides: Partial<MediaValidationPolicy> = {},
): MediaValidationPolicy {
  return {
    minDurationSeconds: 5,
    maxDurationSeconds: 600,
    minWidth: 640,
    minHeight: 360,
    requireAudio: true,
    allowedMimeTypes: ["video/mp4", "video/webm", "video/quicktime"],
    requireCommercialUse: true,
    requireAttribution: true,
    ...overrides,
  };
}
