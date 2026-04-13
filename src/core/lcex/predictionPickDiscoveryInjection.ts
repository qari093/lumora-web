export type PredictionPickDiscoveryCard = {
  id: string;
  pickId: string;
  entityId?: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  fairnessScore: number;
  totalPredictions: number;
};

export type PredictionPickDiscoveryInjectionInput = {
  feedCards: Array<{ id: string; type: string }>;
  candidateCard: PredictionPickDiscoveryCard;
  recentPredictionPickIds: string[];
  maxInsertIndex?: number;
};

export type PredictionPickDiscoveryInjectionDecision = {
  allowed: boolean;
  insertIndex: number | null;
  reason: "ok" | "already_recently_seen" | "feed_too_short" | "low_fairness";
};

export function resolvePredictionPickDiscoveryInjection(
  input: PredictionPickDiscoveryInjectionInput
): PredictionPickDiscoveryInjectionDecision {
  if (input.recentPredictionPickIds.includes(input.candidateCard.pickId)) {
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

export function canInjectPredictionPickIntoDiscovery(
  input: PredictionPickDiscoveryInjectionInput
): boolean {
  return resolvePredictionPickDiscoveryInjection(input).allowed;
}
