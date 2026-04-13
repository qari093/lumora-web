export type VersusCardParticipationSummaryInput = {
  cardId: string;
  leftOptionId: string;
  rightOptionId: string;
  uniqueVoters: number;
  leftVotes: number;
  rightVotes: number;
  averageDecisionSeconds: number;
  totalComments: number;
  resolvedAt: string;
};

export type VersusCardParticipationSummary = {
  cardId: string;
  participationScore: number;
  summaryLine: string;
  winningSide: "left" | "right" | "tie";
  resolvedAt: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildVersusCardParticipationSummary(
  input: VersusCardParticipationSummaryInput
): VersusCardParticipationSummary {
  const winningSide =
    input.leftVotes === input.rightVotes
      ? "tie"
      : input.leftVotes > input.rightVotes
      ? "left"
      : "right";

  const participationScore = clampScore(
    Math.min(input.uniqueVoters, 5000) * 0.015 +
      Math.min(input.leftVotes + input.rightVotes, 5000) * 0.01 +
      Math.min(input.totalComments, 2000) * 0.02 +
      Math.max(0, 60 - input.averageDecisionSeconds) * 0.5
  );

  return {
    cardId: input.cardId.trim(),
    participationScore,
    summaryLine: `${input.uniqueVoters} voters • ${input.leftVotes + input.rightVotes} total votes • ${input.totalComments} comments`,
    winningSide,
    resolvedAt: input.resolvedAt,
  };
}

export function hasMeaningfulVersusParticipation(
  summary: VersusCardParticipationSummary
): boolean {
  return summary.participationScore >= 25;
}
