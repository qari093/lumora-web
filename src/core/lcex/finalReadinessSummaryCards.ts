export type FinalReadinessSummaryInput = {
  readinessId: string;
  scope:
    | "group-a"
    | "group-b"
    | "group-c"
    | "group-d"
    | "group-e"
    | "rollout"
    | "ops"
    | "health"
    | "launch";
  status: "pending" | "ready" | "blocked";
  score: number;
  title: string;
  updatedAt: string;
};

export type FinalReadinessSummaryCard = {
  id: string;
  type: "final-readiness-summary";
  readinessId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  updatedAt: string;
};

export function buildFinalReadinessSummaryCard(
  input: FinalReadinessSummaryInput
): FinalReadinessSummaryCard {
  return {
    id: `final-readiness-summary:${input.readinessId.trim()}`,
    type: "final-readiness-summary",
    readinessId: input.readinessId.trim(),
    title: input.title.trim(),
    subtitle: `${input.scope} readiness`,
    statsLine: `Status ${input.status} • score ${Math.max(0, Math.round(input.score))}`,
    updatedAt: input.updatedAt,
  };
}

export function isFinalReadinessSummaryCardUsable(
  card: FinalReadinessSummaryCard
): boolean {
  return (
    card.readinessId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
