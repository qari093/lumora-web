export type TrendBountyWinnerResolutionInput = {
  bountyId: string;
  submissions: Array<{
    submissionId: string;
    userId: string;
    totalScore: number;
    qualified: boolean;
    createdAt: string;
  }>;
  minimumQualifiedScore?: number;
};

export type TrendBountyWinnerResolution = {
  resolved: boolean;
  winnerSubmissionId: string | null;
  winnerUserId: string | null;
  winningScore: number;
  rankedSubmissionIds: string[];
  reason: "ok" | "no_qualified_submissions";
};

export function resolveTrendBountyWinner(
  input: TrendBountyWinnerResolutionInput
): TrendBountyWinnerResolution {
  const minimumQualifiedScore = input.minimumQualifiedScore ?? 55;

  const ranked = [...input.submissions]
    .filter(
      (submission) =>
        submission.qualified && submission.totalScore >= minimumQualifiedScore
    )
    .sort((a, b) => {
      const scoreDelta = b.totalScore - a.totalScore;
      if (scoreDelta !== 0) return scoreDelta;

      const aTs = Date.parse(a.createdAt);
      const bTs = Date.parse(b.createdAt);
      return (Number.isNaN(aTs) ? 0 : aTs) - (Number.isNaN(bTs) ? 0 : bTs);
    });

  if (ranked.length === 0) {
    return {
      resolved: false,
      winnerSubmissionId: null,
      winnerUserId: null,
      winningScore: 0,
      rankedSubmissionIds: [],
      reason: "no_qualified_submissions",
    };
  }

  const winner = ranked[0];

  return {
    resolved: true,
    winnerSubmissionId: winner.submissionId.trim(),
    winnerUserId: winner.userId.trim(),
    winningScore: Math.max(0, Math.round(winner.totalScore)),
    rankedSubmissionIds: ranked.map((submission) => submission.submissionId.trim()),
    reason: "ok",
  };
}

export function hasResolvedTrendBountyWinner(
  result: TrendBountyWinnerResolution
): boolean {
  return result.resolved && !!result.winnerSubmissionId && !!result.winnerUserId;
}
