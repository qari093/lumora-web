import type { SyncEvent } from "../types";

export function createSyncEvent(type: string): SyncEvent {
  return {
    id: `sync_${type}`,
    type,
    payloadVersion: 1
  };
}
