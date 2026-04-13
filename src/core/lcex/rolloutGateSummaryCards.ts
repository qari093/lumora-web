export type RolloutGateSummaryInput = {
  gateId: string;
  scope:
    | "discovery"
    | "identity"
    | "mood-board"
    | "fandom-badge"
    | "user-control"
    | "habit"
    | "trust"
    | "system-health"
    | "ops";
  status: "draft" | "shadow" | "limited" | "live" | "paused";
  title: string;
  createdAt: string;
};

export type RolloutGateSummaryCard = {
  id: string;
  type: "rollout-gate-summary";
  gateId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  createdAt: string;
};

export function buildRolloutGateSummaryCard(
  input: RolloutGateSummaryInput
): RolloutGateSummaryCard {
  return {
    id: `rollout-gate-summary:${input.gateId.trim()}`,
    type: "rollout-gate-summary",
    gateId: input.gateId.trim(),
    title: input.title.trim(),
    subtitle: `${input.scope} rollout gate`,
    statsLine: `Status ${input.status}`,
    createdAt: input.createdAt,
  };
}

export function isRolloutGateSummaryCardUsable(
  card: RolloutGateSummaryCard
): boolean {
  return (
    card.gateId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
