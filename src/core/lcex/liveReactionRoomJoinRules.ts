export type LiveReactionJoinInput = {
  roomStatus: "scheduled" | "live" | "cooldown" | "closed";
  rightsAllowed: boolean;
  ageGatePassed: boolean;
  regionAllowed: boolean;
  mutedUser: boolean;
};

export type LiveReactionJoinDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "room_not_open"
    | "rights_blocked"
    | "age_gate_required"
    | "region_blocked"
    | "user_muted";
};

export function resolveLiveReactionRoomJoin(
  input: LiveReactionJoinInput
): LiveReactionJoinDecision {
  if (input.mutedUser) {
    return { allowed: false, reason: "user_muted" };
  }

  if (!input.rightsAllowed) {
    return { allowed: false, reason: "rights_blocked" };
  }

  if (!input.ageGatePassed) {
    return { allowed: false, reason: "age_gate_required" };
  }

  if (!input.regionAllowed) {
    return { allowed: false, reason: "region_blocked" };
  }

  if (input.roomStatus !== "scheduled" && input.roomStatus !== "live") {
    return { allowed: false, reason: "room_not_open" };
  }

  return { allowed: true, reason: "ok" };
}

export function canJoinLiveReactionRoom(
  input: LiveReactionJoinInput
): boolean {
  return resolveLiveReactionRoomJoin(input).allowed;
}
