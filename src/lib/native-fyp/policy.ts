export type NativeFypSourceType =
  | "owned_upload"
  | "creator_upload"
  | "royalty_safe"
  | "licensed"
  | "lumora_generated";

export const NATIVE_FYP_ALLOWED_SOURCES: ReadonlySet<NativeFypSourceType> =
  new Set([
    "owned_upload",
    "creator_upload",
    "royalty_safe",
    "licensed",
    "lumora_generated",
  ]);

export const NATIVE_FYP_PROHIBITED_SOURCES = [
  "youtube_iframe",
  "youtube_download",
  "scraped_video",
  "unknown_rights",
  "unlicensed_derivative",
] as const;

export function isNativeFypSourceAllowed(source: string): source is NativeFypSourceType {
  return NATIVE_FYP_ALLOWED_SOURCES.has(source as NativeFypSourceType);
}

export function assertNativeFypSourceAllowed(source: string): void {
  if (!isNativeFypSourceAllowed(source)) {
    throw new Error(`Native FYP prohibited source: ${source}`);
  }
}
