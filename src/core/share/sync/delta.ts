import { createSyncChecksum } from "./checksum";
import type { SyncDelta } from "./types";

export function createSyncDelta(params: {
  objectId: string;
  fromVersion: number;
  toVersion: number;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}): SyncDelta {
  const changes: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params.after)) {
    if (JSON.stringify(params.before[key]) !== JSON.stringify(value)) {
      changes[key] = value;
    }
  }

  return {
    objectId: params.objectId,
    fromVersion: params.fromVersion,
    toVersion: params.toVersion,
    changes,
    checksum: createSyncChecksum(changes),
  };
}

export function applySyncDelta(payload: Record<string, unknown>, delta: SyncDelta): Record<string, unknown> {
  return {
    ...payload,
    ...delta.changes,
    version: delta.toVersion,
  };
}
