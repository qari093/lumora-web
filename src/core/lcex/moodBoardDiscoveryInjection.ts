export type MoodBoardDiscoveryCard = {
  id: string;
  boardId: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  diversityScore: number;
  freshnessScore: number;
};

export type MoodBoardDiscoveryInjectionInput = {
  feedCards: Array<{ id: string; type: string }>;
  candidateCard: MoodBoardDiscoveryCard;
  recentMoodBoardIds: string[];
  maxInsertIndex?: number;
};

export type MoodBoardDiscoveryInjectionDecision = {
  allowed: boolean;
  insertIndex: number | null;
  reason: "ok" | "already_recently_seen" | "feed_too_short" | "low_diversity";
};

export function resolveMoodBoardDiscoveryInjection(
  input: MoodBoardDiscoveryInjectionInput
): MoodBoardDiscoveryInjectionDecision {
  if (input.recentMoodBoardIds.includes(input.candidateCard.boardId)) {
    return {
      allowed: false,
      insertIndex: null,
      reason: "already_recently_seen",
    };
  }

  if (input.candidateCard.diversityScore < 55) {
    return {
      allowed: false,
      insertIndex: null,
      reason: "low_diversity",
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

export function canInjectMoodBoardIntoDiscovery(
  input: MoodBoardDiscoveryInjectionInput
): boolean {
  return resolveMoodBoardDiscoveryInjection(input).allowed;
}
