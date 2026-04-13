export type LiveReactionMessageInput = {
  roomStatus: "scheduled" | "live" | "cooldown" | "closed";
  joinedUser: boolean;
  mutedUser: boolean;
  cooldownSecondsRemaining?: number;
  messageLength: number;
};

export type LiveReactionMessageDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "room_not_live"
    | "user_not_joined"
    | "user_muted"
    | "cooldown_active"
    | "message_too_long";
};

const MAX_MESSAGE_LENGTH = 500;

export function resolveLiveReactionRoomMessage(
  input: LiveReactionMessageInput
): LiveReactionMessageDecision {
  if (input.roomStatus !== "live") {
    return { allowed: false, reason: "room_not_live" };
  }

  if (!input.joinedUser) {
    return { allowed: false, reason: "user_not_joined" };
  }

  if (input.mutedUser) {
    return { allowed: false, reason: "user_muted" };
  }

  if ((input.cooldownSecondsRemaining ?? 0) > 0) {
    return { allowed: false, reason: "cooldown_active" };
  }

  if (input.messageLength <= 0 || input.messageLength > MAX_MESSAGE_LENGTH) {
    return { allowed: false, reason: "message_too_long" };
  }

  return { allowed: true, reason: "ok" };
}

export function canSendLiveReactionRoomMessage(
  input: LiveReactionMessageInput
): boolean {
  return resolveLiveReactionRoomMessage(input).allowed;
}
