export type SystemHealthSummaryInput = {
  signalId: string;
  surface:
    | "discovery"
    | "live-room"
    | "versus"
    | "prediction-pick"
    | "mood-board"
    | "fandom-badge"
    | "identity"
    | "habit"
    | "trust";
  tier: "healthy" | "watch" | "high-risk" | "critical";
  score: number;
  createdAt: string;
};

export type SystemHealthSummaryCard = {
  id: string;
  type: "system-health-summary";
  signalId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  createdAt: string;
};

export function buildSystemHealthSummaryCard(
  input: SystemHealthSummaryInput
): SystemHealthSummaryCard {
  return {
    id: `system-health-summary:${input.signalId.trim()}`,
    type: "system-health-summary",
    signalId: input.signalId.trim(),
    title: `System health for ${input.surface}`,
    subtitle: `Tier ${input.tier}`,
    statsLine: `Score ${Math.max(0, Math.round(input.score))}`,
    createdAt: input.createdAt,
  };
}

export function isSystemHealthSummaryCardUsable(
  card: SystemHealthSummaryCard
): boolean {
  return (
    card.signalId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
