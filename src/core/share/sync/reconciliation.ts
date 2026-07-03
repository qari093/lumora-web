import type { SyncOperation, SyncSnapshot } from "./types";
import { createSyncDelta, applySyncDelta } from "./delta";
import { createSyncSnapshot } from "./snapshot";

export function reconcileSyncState(params: {
  objectId: string;
  local: SyncSnapshot;
  remote: SyncSnapshot;
}) {
  if (params.local.checksum === params.remote.checksum) {
    return {
      state: "synced" as const,
      snapshot: params.remote,
      delta: null,
    };
  }

  const delta = createSyncDelta({
    objectId: params.objectId,
    fromVersion: params.local.version,
    toVersion: Math.max(params.local.version, params.remote.version) + 1,
    before: params.local.payload,
    after: {
      ...params.local.payload,
      ...params.remote.payload,
    },
  });

  const payload = applySyncDelta(params.local.payload, delta);

  return {
    state: "synced" as const,
    snapshot: createSyncSnapshot(params.objectId, delta.toVersion, payload),
    delta,
  };
}

export function createRecoveryOperation(snapshot: SyncSnapshot, actorId: string): SyncOperation {
  return {
    id: `sync_recovery_${snapshot.objectId}_${snapshot.version}`,
    objectId: snapshot.objectId,
    kind: "restore",
    actorId,
    baseVersion: snapshot.version,
    nextVersion: snapshot.version + 1,
    payload: snapshot.payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
    state: "queued",
  };
}
