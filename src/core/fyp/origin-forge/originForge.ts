import type {
  OriginForgeResult,
  OriginForgeWindow
} from "./types";

export function createOriginForgeWindow(input: {
  creatorId: string;
  firstContentId: string;
  now?: number;
}): OriginForgeWindow {
  if (!input.creatorId.trim() || !input.firstContentId.trim()) {
    throw new Error("Origin Forge requires creatorId and firstContentId.");
  }

  const now = input.now ?? Date.now();

  return {
    forgeId: `origin_forge_${input.creatorId}_${now}`,
    creatorId: input.creatorId,
    firstContentId: input.firstContentId,
    startedAt: now,
    expiresAt: now + 72 * 60 * 60 * 1000,
    seedAudienceSize: 5000,
    active: true
  };
}

export function evaluateOriginForge(input: {
  window: OriginForgeWindow;
  impactQuotient: number;
}): OriginForgeResult {
  const graduated = input.impactQuotient >= 250;

  return {
    forgeId: input.window.forgeId,
    creatorId: input.window.creatorId,
    impactQuotient: input.impactQuotient,
    graduated,
    discoveryRowUnlocked: graduated,
    newConstellationBadge: graduated
  };
}
