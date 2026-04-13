export type FinalWaveSummaryInput = {
  progressId: string;
  scope:
    | "master-seal"
    | "final-wave"
    | "launch-corridor"
    | "closeout"
    | "verification";
  title: string;
  status: "pending" | "in-progress" | "complete" | "blocked";
  score: number;
  updatedAt: string;
};

export type FinalWaveSummaryCard = {
  id: string;
  type: "final-wave-summary";
  progressId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  updatedAt: string;
};

export function buildFinalWaveSummaryCard(
  input: FinalWaveSummaryInput
): FinalWaveSummaryCard {
  return {
    id: `final-wave-summary:${input.progressId.trim()}`,
    type: "final-wave-summary",
    progressId: input.progressId.trim(),
    title: input.title.trim(),
    subtitle: `${input.scope} progress`,
    statsLine: `Status ${input.status} • score ${Math.max(0, Math.round(input.score))}`,
    updatedAt: input.updatedAt,
  };
}

export function isFinalWaveSummaryCardUsable(
  card: FinalWaveSummaryCard
): boolean {
  return (
    card.progressId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
