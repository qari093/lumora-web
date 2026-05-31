import type { OfflineQueuedAction, OfflineQueuedActionKind } from "./types";

export function queueOfflineCivilizationAction(input: {
  citizenId: string;
  kind: OfflineQueuedActionKind;
  payload: OfflineQueuedAction["payload"];
}): OfflineQueuedAction {
  if (!input.citizenId.trim()) throw new Error("citizenId_required");

  return {
    id: `offline_${input.citizenId}_${input.kind}_${Date.now()}`,
    citizenId: input.citizenId,
    kind: input.kind,
    payload: input.payload,
    createdAt: Date.now(),
    synced: false,
  };
}

export function markOfflineActionSynced(action: OfflineQueuedAction): OfflineQueuedAction {
  return { ...action, synced: true };
}
