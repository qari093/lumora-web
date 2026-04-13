import type { LumoraContent } from "@/types/content/lumora.content";

export function buildBaseContent(input: {
  id: string;
  title: string;
  summary?: string;
  type?: LumoraContent["type"];
  sourceSignalId?: string;
  sourcePlatform?: string;
  language?: string;
  region?: string;
  metadata?: Record<string, unknown>;
}): LumoraContent {
  const now = Date.now();
  return {
    id: input.id,
    type: input.type || "signal_card",
    title: input.title,
    summary: input.summary,
    createdAt: now,
    updatedAt: now,
    sourceSignalId: input.sourceSignalId,
    sourcePlatform: input.sourcePlatform,
    language: input.language,
    region: input.region,
    metadata: input.metadata || {},
  };
}
