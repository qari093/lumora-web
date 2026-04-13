export type BackupSnapshotInput = {
  snapshotId?: string | null;
  entity?: string | null;
  checksum?: string | null;
  createdAt?: number | null;
  sizeBytes?: number | null;
};

export type BackupSnapshotResult =
  | {
      ok: true;
      snapshot: {
        snapshotId: string;
        entity: string;
        checksum: string;
        createdAt: number;
        sizeBytes: number;
        recoverable: boolean;
      };
    }
  | { ok: false; reason: string };

export function buildBackupSnapshot(
  input: BackupSnapshotInput
): BackupSnapshotResult {
  const snapshotId = typeof input.snapshotId === "string" ? input.snapshotId.trim() : "";
  const entity = typeof input.entity === "string" ? input.entity.trim() : "";
  const checksum = typeof input.checksum === "string" ? input.checksum.trim() : "";
  const createdAt =
    typeof input.createdAt === "number" && Number.isFinite(input.createdAt) && input.createdAt > 0
      ? Math.trunc(input.createdAt)
      : NaN;
  const sizeBytes =
    typeof input.sizeBytes === "number" && Number.isFinite(input.sizeBytes) && input.sizeBytes > 0
      ? Math.trunc(input.sizeBytes)
      : NaN;

  if (!snapshotId) return { ok: false, reason: "missing_snapshot_id" };
  if (!entity) return { ok: false, reason: "missing_entity" };
  if (!checksum) return { ok: false, reason: "missing_checksum" };
  if (!/^[a-fA-F0-9]{8,128}$/.test(checksum)) {
    return { ok: false, reason: "invalid_checksum" };
  }
  if (!Number.isFinite(createdAt)) return { ok: false, reason: "invalid_created_at" };
  if (!Number.isFinite(sizeBytes)) return { ok: false, reason: "invalid_size_bytes" };

  return {
    ok: true,
    snapshot: {
      snapshotId,
      entity,
      checksum: checksum.toLowerCase(),
      createdAt,
      sizeBytes,
      recoverable: true,
    },
  };
}
