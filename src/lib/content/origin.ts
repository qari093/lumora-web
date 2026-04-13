import type { LumoraContent } from "@/types/content/lumora.content";

export function attachSignalOrigin(
  content: LumoraContent,
  signal: {
    id?: string;
    platform?: string;
    language?: string;
    region?: string;
    createdAt?: number;
    updatedAt?: number;
  }
): LumoraContent {
  return {
    ...content,
    sourceSignalId: String(signal.id || content.sourceSignalId || ""),
    sourcePlatform: String(signal.platform || content.sourcePlatform || ""),
    language: String(signal.language || content.language || ""),
    region: String(signal.region || content.region || ""),
    createdAt: typeof signal.createdAt === "number" ? signal.createdAt : content.createdAt,
    updatedAt: typeof signal.updatedAt === "number" ? signal.updatedAt : Date.now(),
  };
}
