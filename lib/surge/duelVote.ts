import type { DuelMatch } from "./duelSchema";

export type DuelVoteInput = {
  duel: DuelMatch;
  side: "left" | "right";
  watchSeconds: number;
  minWatchSeconds?: number;
};

export type DuelVoteResult = {
  accepted: boolean;
  reason: "accepted" | "insufficient_watch_time" | "invalid_side";
  duel: DuelMatch;
};

export function applyDuelVote(input: DuelVoteInput): DuelVoteResult {
  const duel = input.duel;
  const side = input.side;
  const minWatchSeconds = Math.max(1, input.minWatchSeconds ?? 5);
  const watchSeconds = Math.max(0, input.watchSeconds ?? 0);

  if (side !== "left" && side !== "right") {
    return {
      accepted: false,
      reason: "invalid_side",
      duel,
    };
  }

  if (watchSeconds < minWatchSeconds) {
    return {
      accepted: false,
      reason: "insufficient_watch_time",
      duel,
    };
  }

  const updated: DuelMatch =
    side === "left"
      ? {
          ...duel,
          left: { ...duel.left, votes: duel.left.votes + 1 },
        }
      : {
          ...duel,
          right: { ...duel.right, votes: duel.right.votes + 1 },
        };

  return {
    accepted: true,
    reason: "accepted",
    duel: updated,
  };
}
