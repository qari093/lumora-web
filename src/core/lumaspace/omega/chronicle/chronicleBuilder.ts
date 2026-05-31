import type { ChronicleMoment, ChronicleScope, ChronicleStory } from "./types";
import { rankChronicleMoments } from "./chronicleCollector";
import { createChronicleTemplate } from "./chronicleTemplate";
import { createChronicleNarration } from "./chronicleNarrative";

export function buildChronicleStory(input: {
  ownerId: string;
  ownerName: string;
  scope: ChronicleScope;
  monthKey: string;
  moments: ChronicleMoment[];
}): ChronicleStory {
  if (!input.ownerId.trim()) throw new Error("ownerId_required");
  if (!/^\d{4}-\d{2}$/.test(input.monthKey)) throw new Error("monthKey_invalid");

  const template = createChronicleTemplate(input.scope);
  const moments = rankChronicleMoments(input.moments).slice(0, template.maxMoments);

  return {
    id: `chronicle_${input.ownerId}_${input.scope}_${input.monthKey}`,
    ownerId: input.ownerId,
    scope: input.scope,
    monthKey: input.monthKey,
    title: `${input.ownerName}'s ${input.monthKey} Chronicle`,
    moments,
    narration: createChronicleNarration({
      ownerName: input.ownerName,
      scope: input.scope,
      moments,
    }),
    durationSeconds: Math.max(15, Math.min(60, moments.length * 7)),
    shareable: false,
    invitationLine: "Join me on LumaSpace.",
  };
}

export function enableChronicleSharing(story: ChronicleStory): ChronicleStory {
  return {
    ...story,
    shareable: true,
  };
}
