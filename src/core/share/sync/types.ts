export type SyncState = "idle" | "queued" | "syncing" | "synced" | "conflicted" | "failed" | "offline";

export type SyncOperationKind =
  | "create"
  | "update"
  | "delete"
  | "restore"
  | "merge"
  | "presence"
  | "delta";

export type SyncOperation = {
  id: string;
  objectId: string;
  kind: SyncOperationKind;
  actorId: string;
  baseVersion: number;
  nextVersion: number;
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
  state: SyncState;
};

export type SyncDelta = {
  objectId: string;
  fromVersion: number;
  toVersion: number;
  changes: Record<string, unknown>;
  checksum: string;
};

export type SyncConflict = {
  id: string;
  objectId: string;
  localVersion: number;
  remoteVersion: number;
  reason: string;
  resolution: "pending" | "local_wins" | "remote_wins" | "merged";
};

export type SyncSnapshot = {
  objectId: string;
  version: number;
  payload: Record<string, unknown>;
  checksum: string;
  capturedAt: string;
};

export type SyncQueue = {
  id: string;
  operations: SyncOperation[];
  offline: boolean;
};
