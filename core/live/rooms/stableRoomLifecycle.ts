export type RoomState = "scheduled" | "live" | "paused" | "ended";

export function transitionRoom(from: RoomState, to: RoomState) {
  const valid: Record<RoomState, RoomState[]> = {
    scheduled: ["live", "ended"],
    live: ["paused", "ended"],
    paused: ["live", "ended"],
    ended: []
  };

  return {
    ok: valid[from].includes(to),
    from,
    to
  };
}
