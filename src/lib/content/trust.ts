import type { LumoraContent } from "@/types/content/lumora.content";

export function attachTrustScore(
  content: LumoraContent,
  input: { trustScore?: number; trustLevel?: "high" | "medium" | "low" | "blocked" }
): LumoraContent {
  return {
    ...content,
    trustScore: typeof input.trustScore === "number" ? input.trustScore : content.trustScore,
    trustLevel: input.trustLevel || content.trustLevel,
    updatedAt: Date.now(),
  };
}
