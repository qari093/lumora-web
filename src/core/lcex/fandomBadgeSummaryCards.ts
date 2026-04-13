export type FandomBadgeSummaryInput = {
  badgeId: string;
  title: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  ownerCount: number;
  userOwnsBadge: boolean;
  awardedAt?: string;
};

export type FandomBadgeSummaryCard = {
  id: string;
  type: "fandom-badge-summary";
  badgeId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  awardedAt?: string;
};

export function buildFandomBadgeSummaryCard(
  input: FandomBadgeSummaryInput
): FandomBadgeSummaryCard {
  return {
    id: `fandom-badge-summary:${input.badgeId.trim()}`,
    type: "fandom-badge-summary",
    badgeId: input.badgeId.trim(),
    title: input.title.trim(),
    subtitle: `${input.rarity} fandom badge${input.userOwnsBadge ? " • owned" : ""}`,
    statsLine: `${Math.max(0, Math.round(input.ownerCount))} owners`,
    awardedAt: input.awardedAt,
  };
}

export function isFandomBadgeSummaryCardUsable(
  card: FandomBadgeSummaryCard
): boolean {
  return (
    card.badgeId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
