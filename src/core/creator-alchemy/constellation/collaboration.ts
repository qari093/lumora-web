import type { ConstellationId, SilentCollaborationCandidate } from "./types";

export function createSilentCollaborationCandidate(input: {
  creatorA: string;
  creatorB: string;
  sharedConstellation: ConstellationId;
  emotionalOverlap: number;
  consentA: boolean;
  consentB: boolean;
}): SilentCollaborationCandidate {
  const compatibility = normalize(input.emotionalOverlap);

  return {
    creatorA: input.creatorA,
    creatorB: input.creatorB,
    sharedConstellation: input.sharedConstellation,
    compatibility,
    allowed: input.consentA && input.consentB && compatibility >= 0.62
  };
}

function normalize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
