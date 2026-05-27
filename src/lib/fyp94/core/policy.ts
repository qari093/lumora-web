export const FYP94_POLICY_VERSION = "9.4";

export const FYP94_LOCKED_RULES = {
  nativeOnlyCoreFyp: true,
  youtubeCoreFypAllowed: false,
  youtubeTrendMetadataAllowed: true,
  automationFirstSupply: true,
  heavyAiGenerationRequired: false,
  antiOverengineering: true,
} as const;

export type Fyp94ContentSource =
  | "pexels"
  | "pixabay"
  | "mixkit"
  | "coverr"
  | "creator_authorized"
  | "partner_authorized"
  | "lumora_owned";

export const FYP94_APPROVED_SOURCES: ReadonlySet<Fyp94ContentSource> = new Set([
  "pexels",
  "pixabay",
  "mixkit",
  "coverr",
  "creator_authorized",
  "partner_authorized",
  "lumora_owned",
]);

export const FYP94_FORBIDDEN_SOURCE_TYPES = [
  "youtube_download",
  "youtube_rehost",
  "youtube_crop",
  "youtube_iframe_core_fyp",
  "copyrighted_trailer_without_license",
  "brand_removed_third_party_content",
  "unknown_license",
] as const;

export function isApprovedFyp94Source(source: string): source is Fyp94ContentSource {
  return FYP94_APPROVED_SOURCES.has(source as Fyp94ContentSource);
}

export function assertFyp94SourceAllowed(source: string): void {
  if (!isApprovedFyp94Source(source)) {
    throw new Error(`FYP 9.4 blocked source: ${source}`);
  }
}

export function assertNoYouTubeCoreFyp(sourceType: string): void {
  if (sourceType.toLowerCase().includes("youtube")) {
    throw new Error("YouTube is not allowed inside Lumora core FYP playback.");
  }
}
