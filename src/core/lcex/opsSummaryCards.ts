export type OpsSummaryInput = {
  reviewId: string;
  source:
    | "trust-feedback"
    | "system-health"
    | "rights-gate"
    | "live-room"
    | "versus"
    | "prediction-pick"
    | "mood-board"
    | "identity"
    | "habit";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "assigned" | "resolved" | "dismissed";
  title: string;
  createdAt: string;
};

export type OpsSummaryCard = {
  id: string;
  type: "ops-summary";
  reviewId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  createdAt: string;
};

export function buildOpsSummaryCard(
  input: OpsSummaryInput
): OpsSummaryCard {
  return {
    id: `ops-summary:${input.reviewId.trim()}`,
    type: "ops-summary",
    reviewId: input.reviewId.trim(),
    title: input.title.trim(),
    subtitle: `${input.source} • ${input.priority} priority`,
    statsLine: `Status ${input.status}`,
    createdAt: input.createdAt,
  };
}

export function isOpsSummaryCardUsable(
  card: OpsSummaryCard
): boolean {
  return (
    card.reviewId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
