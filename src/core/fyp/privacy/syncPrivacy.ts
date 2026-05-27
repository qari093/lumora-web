export type SyncVisibility =
  | "ghost"
  | "anonymous"
  | "close_circle"
  | "visible";

export type SyncPrivacyState = {
  userId: string;
  visibility: SyncVisibility;
  allowFriendSync: boolean;
  allowSquadSync: boolean;
  allowNearbySync: boolean;
  allowReplaySignals: boolean;
};

export function createSyncPrivacyState(userId: string): SyncPrivacyState {
  if (!userId.trim()) {
    throw new Error("Sync privacy requires userId.");
  }

  return {
    userId,
    visibility: "anonymous",
    allowFriendSync: true,
    allowSquadSync: true,
    allowNearbySync: false,
    allowReplaySignals: false
  };
}

export function canExposeSyncPresence(state: SyncPrivacyState): boolean {
  return state.visibility !== "ghost" && (
    state.allowFriendSync ||
    state.allowSquadSync ||
    state.allowNearbySync
  );
}
