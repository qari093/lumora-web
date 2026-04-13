export type LiveReactionRoomParticipantCapsInput = {
  roomTier: "starter" | "standard" | "premium" | "event";
  currentParticipants: number;
  waitingParticipants?: number;
};

export type LiveReactionRoomParticipantCapsResult = {
  allowed: boolean;
  cap: number;
  waitingCap: number;
  reason: "ok" | "participant_cap_reached" | "waiting_cap_reached";
};

const PARTICIPANT_CAPS: Record<
  LiveReactionRoomParticipantCapsInput["roomTier"],
  { cap: number; waitingCap: number }
> = {
  starter: { cap: 50, waitingCap: 100 },
  standard: { cap: 250, waitingCap: 500 },
  premium: { cap: 1000, waitingCap: 2000 },
  event: { cap: 5000, waitingCap: 10000 },
};

export function resolveLiveReactionRoomParticipantCaps(
  input: LiveReactionRoomParticipantCapsInput
): LiveReactionRoomParticipantCapsResult {
  const limits = PARTICIPANT_CAPS[input.roomTier];
  const waitingParticipants = input.waitingParticipants ?? 0;

  if (input.currentParticipants >= limits.cap) {
    if (waitingParticipants >= limits.waitingCap) {
      return {
        allowed: false,
        cap: limits.cap,
        waitingCap: limits.waitingCap,
        reason: "waiting_cap_reached",
      };
    }

    return {
      allowed: false,
      cap: limits.cap,
      waitingCap: limits.waitingCap,
      reason: "participant_cap_reached",
    };
  }

  return {
    allowed: true,
    cap: limits.cap,
    waitingCap: limits.waitingCap,
    reason: "ok",
  };
}

export function canJoinWithinParticipantCaps(
  input: LiveReactionRoomParticipantCapsInput
): boolean {
  return resolveLiveReactionRoomParticipantCaps(input).allowed;
}
