import type { FypCardType } from "./cardTypes";

export type TeaserCardSchema = {
  id: string;
  type: Extract<FypCardType, "teaser">;
  title: string;
  subtitle?: string;
  sourceName: string;
  sourceUrl?: string;
  teaserUrl?: string;
  posterUrl?: string;
  language?: string;
  region?: string;
  category: "movie" | "series" | "music" | "gaming";
  trustScore?: number;
  releasedAt?: string;
};

export function isTeaserCardSchema(value: unknown): value is TeaserCardSchema {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    v.type === "teaser" &&
    typeof v.title === "string" &&
    typeof v.sourceName === "string" &&
    (v.category === "movie" ||
      v.category === "series" ||
      v.category === "music" ||
      v.category === "gaming")
  );
}
