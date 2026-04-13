export type VersusResultResolutionInput = {
  cardId: string;
  leftOptionId: string;
  rightOptionId: string;
  leftVotes: number;
  rightVotes: number;
  minimumVotes?: number;
};

export type VersusResultResolution = {
  resolved: boolean;
  winnerOptionId: string | null;
  loserOptionId: string | null;
  tie: boolean;
  totalVotes: number;
  margin: number;
  reason: "ok" | "insufficient_votes" | "tie";
};

export function resolveVersusResult(
  input: VersusResultResolutionInput
): VersusResultResolution {
  const minimumVotes = input.minimumVotes ?? 10;
  const leftVotes = Math.max(0, Math.round(input.leftVotes));
  const rightVotes = Math.max(0, Math.round(input.rightVotes));
  const totalVotes = leftVotes + rightVotes;

  if (totalVotes < minimumVotes) {
    return {
      resolved: false,
      winnerOptionId: null,
      loserOptionId: null,
      tie: false,
      totalVotes,
      margin: 0,
      reason: "insufficient_votes",
    };
  }

  if (leftVotes === rightVotes) {
    return {
      resolved: true,
      winnerOptionId: null,
      loserOptionId: null,
      tie: true,
      totalVotes,
      margin: 0,
      reason: "tie",
    };
  }

  const leftWon = leftVotes > rightVotes;

  return {
    resolved: true,
    winnerOptionId: leftWon ? input.leftOptionId.trim() : input.rightOptionId.trim(),
    loserOptionId: leftWon ? input.rightOptionId.trim() : input.leftOptionId.trim(),
    tie: false,
    totalVotes,
    margin: Math.abs(leftVotes - rightVotes),
    reason: "ok",
  };
}

export function hasResolvedVersusWinner(
  result: VersusResultResolution
): boolean {
  return result.resolved && !result.tie && !!result.winnerOptionId;
}
