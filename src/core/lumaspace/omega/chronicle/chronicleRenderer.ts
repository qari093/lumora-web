import type { ChronicleRenderPlan, ChronicleStory } from "./types";
import { createChronicleTemplate } from "./chronicleTemplate";

export function createChronicleRenderPlan(story: ChronicleStory): ChronicleRenderPlan {
  const template = createChronicleTemplate(story.scope);

  return {
    storyId: story.id,
    format: "vertical_short",
    resolution: "720x1280",
    templateId: template.id,
    estimatedCost: story.moments.length > 7 ? "medium" : "low",
    segments: story.moments.map((moment) => ({
      momentId: moment.id,
      durationMs: Math.max(1800, Math.min(6500, 1800 + moment.emotionalWeight * 40)),
      caption: moment.title,
    })),
  };
}
