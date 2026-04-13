import type { LumoraContent } from "@/types/content/lumora.content";

export function attachAttentionMetrics(
  content: LumoraContent,
  input: { attentionScore?: number; velocityScore?: number }
): LumoraContent {
  return {
    ...content,
    attentionScore: input.attentionScore ?? content.attentionScore,
    velocityScore: input.velocityScore ?? content.velocityScore,
    updatedAt: Date.now(),
  };
}
