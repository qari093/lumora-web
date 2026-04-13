import type { FypCardType } from "./cardTypes";

export type TrendCardSchema = {
  id: string;
  type: Extract<FypCardType, "trend">;
  title: string;
  summary: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  signalSource: "search" | "conversation" | "fandom" | "editorial" | "mixed";
  trendScore: number;
  confidenceScore: number;
  culturalConfidence?: "low" | "medium" | "high";
  region?: string;
  language?: string;
  entityIds?: string[];
  relatedCardIds?: string[];
  detectedAt: string;
};

export function isTrendCardSchema(value: unknown): value is TrendCardSchema {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    v.type === "trend" &&
    typeof v.title === "string" &&
    typeof v.summary === "string" &&
    typeof v.trendScore === "number" &&
    typeof v.confidenceScore === "number" &&
    typeof v.detectedAt === "string" &&
    (v.category === "movie" ||
      v.category === "series" ||
      v.category === "music" ||
      v.category === "gaming" ||
      v.category === "cross-media") &&
    (v.signalSource === "search" ||
      v.signalSource === "conversation" ||
      v.signalSource === "fandom" ||
      v.signalSource === "editorial" ||
      v.signalSource === "mixed")
  );
}
