import type { LumoraContent } from "@/types/content/lumora.content";

export function attachEmotionTags(
  content: LumoraContent,
  tags: string[]
): LumoraContent {
  return {
    ...content,
    emotionTags: Array.from(new Set((Array.isArray(tags) ? tags : []).filter(Boolean))).slice(0, 8),
    updatedAt: Date.now(),
  };
}
