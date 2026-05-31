import type { ContributionEvent } from "./types";

export type ReliabilityMark = {
  ownerId: string;
  score: number;
  motif: "seed" | "branch" | "lantern" | "constellation";
  publicRankFree: true;
};

export function createReliabilityMark(ownerId: string, events: ContributionEvent[]): ReliabilityMark {
  const positive = events.filter((event) => event.actorId === ownerId).length;
  const score = Math.min(100, positive * 8);

  const motif: ReliabilityMark["motif"] =
    score >= 80 ? "constellation" :
    score >= 50 ? "lantern" :
    score >= 20 ? "branch" :
    "seed";

  return {
    ownerId,
    score,
    motif,
    publicRankFree: true,
  };
}
