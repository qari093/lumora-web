import type { FypCardType } from "./cardTypes";

export type MetadataOnlyCardSchema = {
  id: string;
  type: Extract<FypCardType, "metadata">;
  title: string;
  subtitle?: string;
  description?: string;
  category: "movie" | "series" | "music" | "gaming";
  posterUrl?: string;
  sourceName: string;
  sourceUrl?: string;
  releaseDate?: string;
  language?: string;
  region?: string;
  trustScore?: number;
  fallbackReason:
    | "missing_media"
    | "blocked_media"
    | "removed_media"
    | "degraded_source"
    | "rights_uncertain";
};

export function isMetadataOnlyCardSchema(
  value: unknown
): value is MetadataOnlyCardSchema {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    v.type === "metadata" &&
    typeof v.title === "string" &&
    typeof v.sourceName === "string" &&
    (v.category === "movie" ||
      v.category === "series" ||
      v.category === "music" ||
      v.category === "gaming") &&
    (v.fallbackReason === "missing_media" ||
      v.fallbackReason === "blocked_media" ||
      v.fallbackReason === "removed_media" ||
      v.fallbackReason === "degraded_source" ||
      v.fallbackReason === "rights_uncertain")
  );
}
