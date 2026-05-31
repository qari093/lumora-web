import type { LivingCardAsset, LivingCardState } from "./types";

export type LivingCardComposition = {
  ownerId: string;
  durationSeconds: number;
  layout: "vertical_identity_reel";
  segments: Array<{
    assetId: string;
    label: string;
    durationMs: number;
  }>;
  soundscape: string;
  renderCost: "low" | "medium";
};

export function composeLivingCard(card: LivingCardState): LivingCardComposition {
  const assets = card.assets.length > 0 ? card.assets : createFallbackAssets(card);

  const segments = assets.slice(0, 5).map((asset) => ({
    assetId: asset.id,
    label: asset.label,
    durationMs: Math.max(1200, Math.min(4000, 1200 + asset.weight * 30)),
  }));

  const totalMs = segments.reduce((sum, segment) => sum + segment.durationMs, 0);

  return {
    ownerId: card.ownerId,
    durationSeconds: Math.max(5, Math.min(30, Math.round(totalMs / 1000))),
    layout: "vertical_identity_reel",
    segments,
    soundscape: `${card.tone}_soft_loop`,
    renderCost: assets.length > 4 ? "medium" : "low",
  };
}

function createFallbackAssets(card: LivingCardState): LivingCardAsset[] {
  return [
    {
      id: `${card.ownerId}_aura`,
      kind: "aura",
      label: `${card.tone} aura`,
      weight: 50,
    },
    {
      id: `${card.ownerId}_verse`,
      kind: "memory",
      label: card.openingVerse,
      weight: 40,
    },
  ];
}
