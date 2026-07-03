import type { SyncSnapshot } from "./types";

export function createEdgeCacheKey(snapshot: SyncSnapshot): string {
  return `usl:sync:${snapshot.objectId}:v${snapshot.version}:${snapshot.checksum}`;
}

export function isSyncSnapshotFresh(snapshot: SyncSnapshot, maxAgeMs: number, now = Date.now()): boolean {
  return now - Date.parse(snapshot.capturedAt) <= maxAgeMs;
}
