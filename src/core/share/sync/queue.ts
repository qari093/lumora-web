import type { SyncOperation, SyncQueue } from "./types";

export function createSyncQueue(id = "usl_sync_queue"): SyncQueue {
  return { id, operations: [], offline: false };
}

export function enqueueSyncOperation(queue: SyncQueue, operation: Omit<SyncOperation, "id" | "createdAt" | "attempts" | "state">): SyncQueue {
  const op: SyncOperation = {
    ...operation,
    id: `sync_${operation.objectId}_${operation.kind}_${operation.nextVersion}`,
    createdAt: new Date().toISOString(),
    attempts: 0,
    state: queue.offline ? "offline" : "queued",
  };

  return {
    ...queue,
    operations: [...queue.operations.filter((item) => item.id !== op.id), op],
  };
}

export function markSyncQueueOffline(queue: SyncQueue, offline: boolean): SyncQueue {
  return {
    ...queue,
    offline,
    operations: queue.operations.map((operation) => ({
      ...operation,
      state: offline && operation.state !== "synced" ? "offline" : operation.state === "offline" ? "queued" : operation.state,
    })),
  };
}

export function nextSyncOperation(queue: SyncQueue): SyncOperation | undefined {
  return queue.operations.find((operation) => operation.state === "queued" || operation.state === "failed");
}

export function completeSyncOperation(queue: SyncQueue, operationId: string): SyncQueue {
  return {
    ...queue,
    operations: queue.operations.map((operation) =>
      operation.id === operationId ? { ...operation, state: "synced" } : operation,
    ),
  };
}

export function failSyncOperation(queue: SyncQueue, operationId: string): SyncQueue {
  return {
    ...queue,
    operations: queue.operations.map((operation) =>
      operation.id === operationId
        ? { ...operation, attempts: operation.attempts + 1, state: "failed" }
        : operation,
    ),
  };
}
