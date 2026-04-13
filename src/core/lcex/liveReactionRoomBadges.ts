export type LiveReactionRoomBadgeType =
  | "first-joiner"
  | "early-wave"
  | "peak-witness"
  | "reaction-storm"
  | "top-commentator"
  | "cooldown-survivor";

export type LiveReactionRoomBadgeInput = {
  roomId: string;
  userId: string;
  joinOrder?: number;
  joinedAt?: string;
  peakWindowJoined?: boolean;
  totalReactions?: number;
  totalMessages?: number;
  stayedUntilCooldown?: boolean;
};

export type LiveReactionRoomBadge = {
  id: string;
  roomId: string;
  userId: string;
  badge: LiveReactionRoomBadgeType;
};

export function buildLiveReactionRoomBadges(
  input: LiveReactionRoomBadgeInput
): LiveReactionRoomBadge[] {
  const badges: LiveReactionRoomBadge[] = [];

  if ((input.joinOrder ?? Number.POSITIVE_INFINITY) === 1) {
    badges.push({
      id: `live-room-badge:${input.roomId}:${input.userId}:first-joiner`,
      roomId: input.roomId.trim(),
      userId: input.userId.trim(),
      badge: "first-joiner",
    });
  }

  if ((input.joinOrder ?? Number.POSITIVE_INFINITY) <= 25) {
    badges.push({
      id: `live-room-badge:${input.roomId}:${input.userId}:early-wave`,
      roomId: input.roomId.trim(),
      userId: input.userId.trim(),
      badge: "early-wave",
    });
  }

  if (input.peakWindowJoined) {
    badges.push({
      id: `live-room-badge:${input.roomId}:${input.userId}:peak-witness`,
      roomId: input.roomId.trim(),
      userId: input.userId.trim(),
      badge: "peak-witness",
    });
  }

  if ((input.totalReactions ?? 0) >= 20) {
    badges.push({
      id: `live-room-badge:${input.roomId}:${input.userId}:reaction-storm`,
      roomId: input.roomId.trim(),
      userId: input.userId.trim(),
      badge: "reaction-storm",
    });
  }

  if ((input.totalMessages ?? 0) >= 10) {
    badges.push({
      id: `live-room-badge:${input.roomId}:${input.userId}:top-commentator`,
      roomId: input.roomId.trim(),
      userId: input.userId.trim(),
      badge: "top-commentator",
    });
  }

  if (input.stayedUntilCooldown) {
    badges.push({
      id: `live-room-badge:${input.roomId}:${input.userId}:cooldown-survivor`,
      roomId: input.roomId.trim(),
      userId: input.userId.trim(),
      badge: "cooldown-survivor",
    });
  }

  return badges;
}

export function hasLiveReactionRoomBadge(
  badges: LiveReactionRoomBadge[],
  badge: LiveReactionRoomBadgeType
): boolean {
  return badges.some((entry) => entry.badge === badge);
}
