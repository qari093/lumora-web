import { describe, expect, it } from "vitest";
import {
  applySyncDelta,
  completeSyncOperation,
  createEdgeCacheKey,
  createRecoveryOperation,
  createSyncDelta,
  createSyncQueue,
  createSyncSnapshot,
  detectSyncConflict,
  enqueueSyncOperation,
  failSyncOperation,
  isSyncSnapshotFresh,
  markSyncQueueOffline,
  mergeSyncPayloads,
  nextSyncOperation,
  reconcileSyncState,
  resolveSyncConflict,
  verifySyncSnapshot,
} from "@/src/core/share";

describe("USL Mega Pack 08 — Living Synchronization Ω", () => {
  it("creates offline-capable sync queues and operation lifecycle", () => {
    const queue = createSyncQueue();
    const queued = enqueueSyncOperation(queue, {
      objectId: "memory_1",
      kind: "update",
      actorId: "waqar",
      baseVersion: 1,
      nextVersion: 2,
      payload: { title: "Updated" },
    });

    const next = nextSyncOperation(queued);
    if (!next) throw new Error("missing_next_sync_operation");

    const failed = failSyncOperation(queued, next.id);
    const completed = completeSyncOperation(failed, next.id);
    const offline = markSyncQueueOffline(completed, true);

    expect(next.kind).toBe("update");
    expect(failed.operations[0].attempts).toBe(1);
    expect(completed.operations[0].state).toBe("synced");
    expect(offline.offline).toBe(true);
  });

  it("creates deltas, applies them, and verifies snapshots", () => {
    const before = { title: "A", mood: "calm", version: 1 };
    const after = { title: "B", mood: "wonder", version: 2 };
    const delta = createSyncDelta({
      objectId: "memory_1",
      fromVersion: 1,
      toVersion: 2,
      before,
      after,
    });

    const applied = applySyncDelta(before, delta);
    const snapshot = createSyncSnapshot("memory_1", 2, applied);

    expect(delta.changes.title).toBe("B");
    expect(applied.version).toBe(2);
    expect(verifySyncSnapshot(snapshot)).toBe(true);
  });

  it("detects conflicts and resolves merged payloads", () => {
    const local = createSyncSnapshot("memory_1", 2, { title: "Local" });
    const remote = createSyncSnapshot("memory_1", 3, { title: "Remote", mood: "wonder" });
    const conflict = detectSyncConflict({
      objectId: "memory_1",
      localVersion: local.version,
      remoteVersion: remote.version,
      localChecksum: local.checksum,
      remoteChecksum: remote.checksum,
    });

    if (!conflict) throw new Error("missing_conflict");

    const resolved = resolveSyncConflict(conflict, "merged");
    const merged = mergeSyncPayloads(local.payload, remote.payload);

    expect(conflict.resolution).toBe("pending");
    expect(resolved.resolution).toBe("merged");
    expect(merged.title).toBe("Remote");
    expect(merged.mood).toBe("wonder");
  });

  it("reconciles local and remote snapshots with recovery", () => {
    const local = createSyncSnapshot("memory_1", 1, { title: "Local", version: 1 });
    const remote = createSyncSnapshot("memory_1", 2, { title: "Remote", version: 2 });
    const reconciliation = reconcileSyncState({ objectId: "memory_1", local, remote });
    const recovery = createRecoveryOperation(reconciliation.snapshot, "waqar");

    expect(reconciliation.state).toBe("synced");
    expect(reconciliation.snapshot.version).toBeGreaterThan(2);
    expect(recovery.kind).toBe("restore");
  });

  it("supports edge cache freshness for synchronized living objects", () => {
    const snapshot = createSyncSnapshot("memory_1", 1, { title: "Cache" });
    const key = createEdgeCacheKey(snapshot);

    expect(key).toContain("usl:sync:memory_1");
    expect(isSyncSnapshotFresh(snapshot, 60000)).toBe(true);
  });
});
