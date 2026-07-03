import type { SyncConflict } from "./types";

export function detectSyncConflict(params: {
  objectId: string;
  localVersion: number;
  remoteVersion: number;
  localChecksum: string;
  remoteChecksum: string;
}): SyncConflict | null {
  if (params.localVersion === params.remoteVersion && params.localChecksum === params.remoteChecksum) return null;

  return {
    id: `sync_conflict_${params.objectId}_${params.localVersion}_${params.remoteVersion}`,
    objectId: params.objectId,
    localVersion: params.localVersion,
    remoteVersion: params.remoteVersion,
    reason: "Local and remote versions diverged.",
    resolution: "pending",
  };
}

export function resolveSyncConflict(
  conflict: SyncConflict,
  resolution: "local_wins" | "remote_wins" | "merged",
): SyncConflict {
  return { ...conflict, resolution };
}

export function mergeSyncPayloads(
  local: Record<string, unknown>,
  remote: Record<string, unknown>,
  prefer: "local" | "remote" = "remote",
): Record<string, unknown> {
  return prefer === "local" ? { ...remote, ...local } : { ...local, ...remote };
}
