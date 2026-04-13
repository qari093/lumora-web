export type VersusCardSummaryInput = {
  cardId: string;
  title: string;
  leftLabel: string;
  rightLabel: string;
  winnerLabel?: string;
  totalVotes: number;
  margin: number;
  tie: boolean;
  resolvedAt: string;
};

export type VersusCardSummaryCard = {
  id: string;
  type: "versus-summary";
  cardId: string;
  title: string;
  outcomeLine: string;
  statsLine: string;
  resolvedAt: string;
};

export function buildVersusCardSummary(
  input: VersusCardSummaryInput
): VersusCardSummaryCard {
  const outcomeLine = input.tie
    ? `${input.leftLabel.trim()} vs ${input.rightLabel.trim()} ended in a tie`
    : `${(input.winnerLabel || "").trim()} won the matchup`;

  return {
    id: `versus-summary:${input.cardId.trim()}`,
    type: "versus-summary",
    cardId: input.cardId.trim(),
    title: input.title.trim(),
    outcomeLine,
    statsLine: `${Math.max(0, Math.round(input.totalVotes))} votes • margin ${Math.max(0, Math.round(input.margin))}`,
    resolvedAt: input.resolvedAt,
  };
}

export function isVersusCardSummaryUsable(
  card: VersusCardSummaryCard
): boolean {
  return (
    card.cardId.length > 0 &&
    card.title.length > 0 &&
    card.outcomeLine.length > 0 &&
    card.statsLine.length > 0
  );
}
