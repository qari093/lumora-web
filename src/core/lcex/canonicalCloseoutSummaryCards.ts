export type CanonicalCloseoutSummaryInput = {
  closeoutId: string;
  scope:
    | "contracts"
    | "guards"
    | "telemetry"
    | "summaries"
    | "locks"
    | "readiness"
    | "launch";
  title: string;
  status: "pending" | "complete" | "blocked";
  score: number;
  updatedAt: string;
};

export type CanonicalCloseoutSummaryCard = {
  id: string;
  type: "canonical-closeout-summary";
  closeoutId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  updatedAt: string;
};

export function buildCanonicalCloseoutSummaryCard(
  input: CanonicalCloseoutSummaryInput
): CanonicalCloseoutSummaryCard {
  return {
    id: `canonical-closeout-summary:${input.closeoutId.trim()}`,
    type: "canonical-closeout-summary",
    closeoutId: input.closeoutId.trim(),
    title: input.title.trim(),
    subtitle: `${input.scope} closeout`,
    statsLine: `Status ${input.status} • score ${Math.max(0, Math.round(input.score))}`,
    updatedAt: input.updatedAt,
  };
}

export function isCanonicalCloseoutSummaryCardUsable(
  card: CanonicalCloseoutSummaryCard
): boolean {
  return (
    card.closeoutId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
