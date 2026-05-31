export type LivingCardDockState = {
  citizenId: string;
  docked: boolean;
  previewOpen: boolean;
  supportsVideoProfile: boolean;
  supportsAiLivingCard: boolean;
  activeProfileMode: "static" | "video" | "living_card";
};

export function createLivingCardDock(input: {
  citizenId: string;
  supportsVideoProfile?: boolean;
  supportsAiLivingCard?: boolean;
  activeProfileMode?: LivingCardDockState["activeProfileMode"];
}): LivingCardDockState {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");

  return {
    citizenId: input.citizenId,
    docked: true,
    previewOpen: false,
    supportsVideoProfile: input.supportsVideoProfile !== false,
    supportsAiLivingCard: input.supportsAiLivingCard !== false,
    activeProfileMode: input.activeProfileMode ?? "living_card",
  };
}

export function openLivingCardPreview(state: LivingCardDockState): LivingCardDockState {
  return { ...state, previewOpen: true };
}

export function closeLivingCardPreview(state: LivingCardDockState): LivingCardDockState {
  return { ...state, previewOpen: false };
}
