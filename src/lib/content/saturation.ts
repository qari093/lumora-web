import type { LumoraContent } from "@/types/content/lumora.content";

export function attachSaturationIndex(
  content: LumoraContent,
  saturationIndex?: number
): LumoraContent {
  return {
    ...content,
    saturationIndex: typeof saturationIndex === "number" ? saturationIndex : content.saturationIndex,
    updatedAt: Date.now(),
  };
}
