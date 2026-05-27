import type {
  CreatorDraftWindow
} from "./types";

export function createCreatorDraftWindow(input: {
  opensAt: number;
  closesAt: number;
  maxSelections?: number;
}): CreatorDraftWindow {
  if (input.closesAt <= input.opensAt) {
    throw new Error("Draft closesAt must be after opensAt.");
  }

  return {
    draftId: `draft_${input.opensAt}`,
    opensAt: input.opensAt,
    closesAt: input.closesAt,
    active: true,
    maxSelections: input.maxSelections ?? 100
  };
}
