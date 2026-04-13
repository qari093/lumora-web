import type { DuelMatch } from "./duelSchema";

export function startDuel(duel: DuelMatch): DuelMatch {
  return {
    ...duel,
    status: "live",
    startedAt: Date.now(),
  };
}

export function resolveDuel(duel: DuelMatch): DuelMatch & {
  winner: "left" | "right" | "tie";
} {
  const winner =
    duel.left.votes > duel.right.votes
      ? "left"
      : duel.right.votes > duel.left.votes
        ? "right"
        : "tie";

  return {
    ...duel,
    status: "resolved",
    resolvedAt: Date.now(),
    winner,
  };
}
