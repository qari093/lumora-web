import type {
  DraftCandidate,
  DraftTier
} from "./types";

export function createDraftCandidate(input: {
  creatorId: string;
  auraTier: DraftTier;
  impactQuotient: number;
}): DraftCandidate {
  if (!input.creatorId.trim()) {
    throw new Error("Draft candidate requires creatorId.");
  }

  return {
    creatorId: input.creatorId,
    auraTier: input.auraTier,
    impactQuotient: input.impactQuotient,
    eligible:
      input.auraTier !== "eclipse" &&
      input.impactQuotient >= 100
  };
}

export function rankDraftCandidates(
  candidates: DraftCandidate[]
): DraftCandidate[] {
  return [...candidates].sort(
    (a, b) => b.impactQuotient - a.impactQuotient
  );
}
