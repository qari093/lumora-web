import type {
  DraftSelection
} from "./types";

export function createDraftSelection(input: {
  scoutId: string;
  creatorId: string;
  constellationId: string;
}): DraftSelection {
  if (
    !input.scoutId.trim() ||
    !input.creatorId.trim() ||
    !input.constellationId.trim()
  ) {
    throw new Error("Draft selection requires scout, creator, and constellation.");
  }

  return {
    scoutId: input.scoutId,
    creatorId: input.creatorId,
    constellationId: input.constellationId,
    approved: true
  };
}
