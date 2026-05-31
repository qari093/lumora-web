import type { OfflineQueuedAction, OfflineSyncReport } from "./types";
import { markOfflineActionSynced } from "./offlineQueue";

export function syncOfflineCivilization(input: {
  citizenId: string;
  actions: OfflineQueuedAction[];
}): { actions: OfflineQueuedAction[]; report: OfflineSyncReport } {
  const own = input.actions.filter((action) => action.citizenId === input.citizenId);
  const synced = own.map(markOfflineActionSynced);

  return {
    actions: synced,
    report: {
      citizenId: input.citizenId,
      attempted: own.length,
      synced: synced.length,
      failed: 0,
      conflictMode: "last_write_wins",
    },
  };
}
