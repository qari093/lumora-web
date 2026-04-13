export type LiveReactionRoomDiscoveryCard = {
  id: string;
  type: "live-reaction-room";
  roomId: string;
  entityId: string;
  title: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  liveCount: number;
  heatScore: number;
  region?: string;
  language?: string;
};

export type LiveReactionRoomDiscoveryInjectionInput = {
  feedCards: Array<{ id: string; type: string }>;
  candidateCard: LiveReactionRoomDiscoveryCard;
  maxInsertIndex?: number;
  recentLiveRoomIds: string[];
};

export type LiveReactionRoomDiscoveryInjectionDecision = {
  allowed: boolean;
  insertIndex: number | null;
  reason: "ok" | "already_recently_seen" | "feed_too_short";
};

export function resolveLiveReactionRoomDiscoveryInjection(
  input: LiveReactionRoomDiscoveryInjectionInput
): LiveReactionRoomDiscoveryInjectionDecision {
  if (input.recentLiveRoomIds.includes(input.candidateCard.roomId)) {
    return {
      allowed: false,
      insertIndex: null,
      reason: "already_recently_seen",
    };
  }

  if (input.feedCards.length < 3) {
    return {
      allowed: false,
      insertIndex: null,
      reason: "feed_too_short",
    };
  }

  const maxInsertIndex = Math.max(1, input.maxInsertIndex ?? 6);
  const insertIndex = Math.min(maxInsertIndex, input.feedCards.length);

  return {
    allowed: true,
    insertIndex,
    reason: "ok",
  };
}

export function canInjectLiveReactionRoomIntoDiscovery(
  input: LiveReactionRoomDiscoveryInjectionInput
): boolean {
  return resolveLiveReactionRoomDiscoveryInjection(input).allowed;
}
