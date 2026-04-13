export type VersusDiscoveryCard = {
  id: string;
  cardId: string;
  leftEntityId: string;
  rightEntityId: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  fairnessScore: number;
  voteCount: number;
};

export type VersusCardDiscoveryInjectionInput = {
  feedCards: Array<{ id: string; type: string }>;
  candidateCard: VersusDiscoveryCard;
  recentVersusCardIds: string[];
  maxInsertIndex?: number;
};

export type VersusCardDiscoveryInjectionDecision = {
  allowed: boolean;
  insertIndex: number | null;
  reason: "ok" | "already_recently_seen" | "feed_too_short" | "low_fairness";
};

export function resolveVersusCardDiscoveryInjection(
  input: VersusCardDiscoveryInjectionInput
): VersusCardDiscoveryInjectionDecision {
  if (input.recentVersusCardIds.includes(input.candidateCard.cardId)) {
    return {
      allowed: false,
      insertIndex: null,
      reason: "already_recently_seen",
    };
  }

  if (input.candidateCard.fairnessScore < 60) {
    return {
      allowed: false,
      insertIndex: null,
      reason: "low_fairness",
    };
  }

  if (input.feedCards.length < 4) {
    return {
      allowed: false,
      insertIndex: null,
      reason: "feed_too_short",
    };
  }

  const maxInsertIndex = Math.max(2, input.maxInsertIndex ?? 7);
  const insertIndex = Math.min(maxInsertIndex, input.feedCards.length);

  return {
    allowed: true,
    insertIndex,
    reason: "ok",
  };
}

export function canInjectVersusCardIntoDiscovery(
  input: VersusCardDiscoveryInjectionInput
): boolean {
  return resolveVersusCardDiscoveryInjection(input).allowed;
}
