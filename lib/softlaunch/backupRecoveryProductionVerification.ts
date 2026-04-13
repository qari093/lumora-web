export type BackupRecoverySnapshot = {
  snapshotId: string;
  entity: string;
  checksum: string;
  restorable: boolean;
  retentionDays: number;
};

export type BackupRecoveryProductionVerificationInput = {
  snapshots?: BackupRecoverySnapshot[] | null;
};

export type BackupRecoveryProductionVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        restorable: number;
        retained: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateBackupRecoveryProductionVerification(
  input: BackupRecoveryProductionVerificationInput
): BackupRecoveryProductionVerificationResult {
  const snapshots = Array.isArray(input.snapshots) ? input.snapshots : [];
  if (snapshots.length === 0) return { ok: false, reason: "missing_snapshots" };

  const ids = new Set<string>();
  let restorable = 0;
  let retained = 0;

  for (const snap of snapshots) {
    if (!snap.snapshotId?.trim()) return { ok: false, reason: "missing_snapshot_id" };
    if (ids.has(snap.snapshotId)) return { ok: false, reason: "duplicate_snapshot_id" };
    ids.add(snap.snapshotId);

    if (!snap.entity?.trim()) return { ok: false, reason: "missing_entity" };
    if (!/^[a-fA-F0-9]{8,128}$/.test(snap.checksum || "")) {
      return { ok: false, reason: "invalid_checksum" };
    }
    if (!Number.isFinite(snap.retentionDays) || snap.retentionDays < 1) {
      return { ok: false, reason: "invalid_retention_days" };
    }

    if (snap.restorable) restorable += 1;
    if (snap.retentionDays >= 7) retained += 1;
  }

  return {
    ok: true,
    verification: {
      total: snapshots.length,
      restorable,
      retained,
      ready: restorable === snapshots.length && retained === snapshots.length,
    },
  };
}
