import { createSyncChecksum } from "./checksum";
import type { SyncSnapshot } from "./types";

export function createSyncSnapshot(objectId: string, version: number, payload: Record<string, unknown>): SyncSnapshot {
  return {
    objectId,
    version,
    payload: { ...payload },
    checksum: createSyncChecksum(payload),
    capturedAt: new Date().toISOString(),
  };
}

export function verifySyncSnapshot(snapshot: SyncSnapshot): boolean {
  return snapshot.checksum === createSyncChecksum(snapshot.payload);
}
