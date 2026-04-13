export type TrendBountyCardSchema = {
  id: string;
  type: "trend-bounty";
  entityId: string;
  title: string;
  prompt: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  status: "open" | "review" | "closed";
  rewardLabel: string;
  startsAt: string;
  endsAt: string;
  region?: string;
  language?: string;
};

export function createTrendBountyCard(
  input: TrendBountyCardSchema
): TrendBountyCardSchema {
  return input;
}

export function isTrendBountyActive(card: TrendBountyCardSchema): boolean {
  const now = Date.now();
  return Date.parse(card.startsAt) <= now && Date.parse(card.endsAt) >= now;
}
