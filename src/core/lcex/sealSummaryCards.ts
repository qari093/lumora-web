export type SealSummaryInput = {
  sealId: string;
  scope:
    | "group-a"
    | "group-b"
    | "group-c"
    | "group-d"
    | "group-e"
    | "group-f"
    | "canonical-closeout"
    | "launch";
  title: string;
  status: "pending" | "sealed" | "revoked";
  updatedAt: string;
};

export type SealSummaryCard = {
  id: string;
  type: "seal-summary";
  sealId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  updatedAt: string;
};

export function buildSealSummaryCard(
  input: SealSummaryInput
): SealSummaryCard {
  return {
    id: `seal-summary:${input.sealId.trim()}`,
    type: "seal-summary",
    sealId: input.sealId.trim(),
    title: input.title.trim(),
    subtitle: `${input.scope} seal`,
    statsLine: `Status ${input.status}`,
    updatedAt: input.updatedAt,
  };
}

export function isSealSummaryCardUsable(
  card: SealSummaryCard
): boolean {
  return (
    card.sealId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
