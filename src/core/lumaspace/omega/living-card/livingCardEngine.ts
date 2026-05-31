import type { LivingCardAsset, LivingCardState, LivingCardTone, ProfileMode } from "./types";

export function createLivingCard(input: {
  ownerId: string;
  ownerType?: LivingCardState["ownerType"];
  mode?: ProfileMode;
  tone?: LivingCardTone;
  title: string;
  openingVerse: string;
  privacy?: LivingCardState["privacy"];
  assets?: LivingCardAsset[];
}): LivingCardState {
  if (!input.ownerId.trim()) throw new Error("ownerId_required");
  if (!input.title.trim()) throw new Error("title_required");
  if (input.openingVerse.length > 80) throw new Error("opening_verse_too_long");

  return {
    ownerId: input.ownerId,
    ownerType: input.ownerType ?? "citizen",
    mode: input.mode ?? "living_card",
    tone: input.tone ?? "builder",
    title: input.title,
    openingVerse: input.openingVerse,
    assets: input.assets ?? [],
    version: 1,
    shareable: false,
    privacy: input.privacy ?? "inner_circle",
  };
}

export function addLivingCardAsset(card: LivingCardState, asset: LivingCardAsset): LivingCardState {
  if (!asset.id.trim()) throw new Error("asset_id_required");

  return {
    ...card,
    assets: [...card.assets, asset].sort((a, b) => b.weight - a.weight),
    version: card.version + 1,
  };
}

export function setLivingCardMode(card: LivingCardState, mode: ProfileMode): LivingCardState {
  return {
    ...card,
    mode,
    version: card.version + 1,
  };
}

export function enableLivingCardSharing(card: LivingCardState): LivingCardState {
  return {
    ...card,
    shareable: true,
    privacy: "public",
    version: card.version + 1,
  };
}
