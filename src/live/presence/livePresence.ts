export type LivePresenceState = {
  roomId: string;
  userId: string;
  mode: "visible" | "ghost";
  joinedAt: string;
};

export function createLivePresence(roomId: string, userId: string, mode: LivePresenceState["mode"] = "visible"): LivePresenceState {
  return {
    roomId,
    userId,
    mode,
    joinedAt: new Date().toISOString(),
  };
}

export function isGhostPresence(state: LivePresenceState): boolean {
  return state.mode === "ghost";
}
