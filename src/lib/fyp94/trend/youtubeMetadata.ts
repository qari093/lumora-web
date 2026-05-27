import type { Fyp94TrendInput } from "./types";

export function createYouTubeMetadataTrend(input: {
  id: string;
  title: string;
  keywords: string[];
  category: string;
}): Fyp94TrendInput {
  return {
    id: input.id,
    source: "youtube_metadata",
    title: input.title,
    keywords: input.keywords,
    category: input.category,
    capturedAt: new Date().toISOString(),
  };
}
