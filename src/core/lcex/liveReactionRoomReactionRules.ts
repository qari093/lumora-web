export type LiveReactionRoomReactionInput = {
  roomStatus: "scheduled" | "live" | "cooldown" | "closed";
  joinedUser: boolean;
  mutedUser: boolean;
  reactionCooldownMs?: number;
  lastReactionAt?: string;
  reactionType: string;
};

export type LiveReactionRoomReactionDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "room_not_live"
    | "user_not_joined"
    | "user_muted"
    | "reaction_cooldown_active"
    | "invalid_reaction";
};

const ALLOWED_REACTIONS = new Set([
  "fire",
  "wow",
  "laugh",
  "love",
  "shock",
  "clap",
  "hype",
  "thinking",
]);

export function resolveLiveReactionRoomReaction(
  input: LiveReactionRoomReactionInput
): LiveReactionRoomReactionDecision {
  if (input.roomStatus !== "live") {
    return { allowed: false, reason: "room_not_live" };
  }

  if (!input.joinedUser) {
    return { allowed: false, reason: "user_not_joined" };
  }

  if (input.mutedUser) {
    return { allowed: false, reason: "user_muted" };
  }

  if (!ALLOWED_REACTIONS.has(input.reactionType.trim().toLowerCase())) {
    return { allowed: false, reason: "invalid_reaction" };
  }

  const cooldownMs = input.reactionCooldownMs ?? 1200;
  if (input.lastReactionAt) {
    const delta = Date.now() - Date.parse(input.lastReactionAt);
    if (!Number.isNaN(delta) && delta >= 0 && delta < cooldownMs) {
      return { allowed: false, reason: "reaction_cooldown_active" };
    }
  }

  return { allowed: true, reason: "ok" };
}

export function canSendLiveReactionRoomReaction(
  input: LiveReactionRoomReactionInput
): boolean {
  return resolveLiveReactionRoomReaction(input).allowed;
}
