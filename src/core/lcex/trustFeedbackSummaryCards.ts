export type TrustFeedbackSummaryInput = {
  feedbackId: string;
  surface:
    | "discovery"
    | "live-room"
    | "versus"
    | "prediction-pick"
    | "mood-board"
    | "fandom-badge"
    | "identity"
    | "habit";
  sentiment: "positive" | "neutral" | "negative";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
};

export type TrustFeedbackSummaryCard = {
  id: string;
  type: "trust-feedback-summary";
  feedbackId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  createdAt: string;
};

export function buildTrustFeedbackSummaryCard(
  input: TrustFeedbackSummaryInput
): TrustFeedbackSummaryCard {
  return {
    id: `trust-feedback-summary:${input.feedbackId.trim()}`,
    type: "trust-feedback-summary",
    feedbackId: input.feedbackId.trim(),
    title: `Trust feedback on ${input.surface}`,
    subtitle: `${input.sentiment} sentiment • ${input.priority} priority`,
    statsLine: `Status ${input.status}`,
    createdAt: input.createdAt,
  };
}

export function isTrustFeedbackSummaryCardUsable(
  card: TrustFeedbackSummaryCard
): boolean {
  return (
    card.feedbackId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
