export type TrendBountyStatus =
  | "draft"
  | "open"
  | "active"
  | "cooldown"
  | "closed"
  | "cancelled";

export type TrendBountyCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type TrendBountyRecord = {
  id: string;
  title: string;
  entityId?: string;
  category: TrendBountyCategory;
  region?: string;
  language?: string;
  status: TrendBountyStatus;
  rewardLabel: string;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
};

export const TREND_BOUNTY_REGISTRY: TrendBountyRecord[] = [];

export function registerTrendBounty(
  bounty: TrendBountyRecord
): void {
  TREND_BOUNTY_REGISTRY.push({
    ...bounty,
    id: bounty.id.trim(),
    title: bounty.title.trim(),
    entityId: bounty.entityId?.trim(),
    region: bounty.region?.trim().toLowerCase(),
    language: bounty.language?.trim().toLowerCase(),
    rewardLabel: bounty.rewardLabel.trim(),
  });
}

export function getTrendBountyById(
  id: string
): TrendBountyRecord | undefined {
  const normalizedId = id.trim();
  return TREND_BOUNTY_REGISTRY.find((bounty) => bounty.id === normalizedId);
}

export function getActiveTrendBounties(): TrendBountyRecord[] {
  return TREND_BOUNTY_REGISTRY
    .filter((bounty) => bounty.status === "open" || bounty.status === "active")
    .sort((a, b) => {
      const aTs = Date.parse(a.startsAt || a.createdAt);
      const bTs = Date.parse(b.startsAt || b.createdAt);
      return (Number.isNaN(aTs) ? 0 : aTs) - (Number.isNaN(bTs) ? 0 : bTs);
    });
}
