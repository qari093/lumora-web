import type {
  Constellation
} from "./types";

export function createConstellation(input: {
  title: string;
  scoutId: string;
  creatorIds: string[];
}): Constellation {
  if (
    !input.title.trim() ||
    !input.scoutId.trim()
  ) {
    throw new Error("Constellation requires title and scoutId.");
  }

  if (input.creatorIds.length === 0) {
    throw new Error("Constellation requires creators.");
  }

  return {
    constellationId: `constellation_${input.scoutId}_${Date.now()}`,
    title: input.title,
    scoutId: input.scoutId,
    creatorIds: input.creatorIds,
    active: true
  };
}
