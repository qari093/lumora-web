import type { LivingCardState } from "./types";

export type LivingCardSharePayload = {
  ownerId: string;
  title: string;
  mode: LivingCardState["mode"];
  urlPath: string;
  previewText: string;
  safeToShare: boolean;
};

export function createLivingCardSharePayload(card: LivingCardState): LivingCardSharePayload {
  return {
    ownerId: card.ownerId,
    title: card.title,
    mode: card.mode,
    urlPath: `/lumaspace/card/${encodeURIComponent(card.ownerId)}`,
    previewText: `${card.title} · ${card.openingVerse}`,
    safeToShare: card.shareable && card.privacy === "public",
  };
}
