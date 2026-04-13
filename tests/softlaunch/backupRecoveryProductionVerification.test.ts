import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateBackupRecoveryProductionVerification } from "@/lib/softlaunch/backupRecoveryProductionVerification";

describe("soft-launch backup / recovery production verification", () => {
  it("passes valid backup snapshots", () => {
    const snapshots = JSON.parse(fs.readFileSync("data/softlaunch/backup-recovery.json", "utf8"));
    const out = evaluateBackupRecoveryProductionVerification({ snapshots });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(3);
      expect(out.verification.restorable).toBe(3);
      expect(out.verification.retained).toBe(3);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate snapshot id", () => {
    const out = evaluateBackupRecoveryProductionVerification({
      snapshots: [
        { snapshotId: "s1", entity: "wallet", checksum: "abcdef12", restorable: true, retentionDays: 7 },
        { snapshotId: "s1", entity: "feed", checksum: "abcdef34", restorable: true, retentionDays: 7 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_snapshot_id" });
  });

  it("rejects invalid checksum", () => {
    const out = evaluateBackupRecoveryProductionVerification({
      snapshots: [
        { snapshotId: "s1", entity: "wallet", checksum: "bad-checksum", restorable: true, retentionDays: 7 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_checksum" });
  });

  it("rejects invalid retention days", () => {
    const out = evaluateBackupRecoveryProductionVerification({
      snapshots: [
        { snapshotId: "s1", entity: "wallet", checksum: "abcdef12", restorable: true, retentionDays: 0 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_retention_days" });
  });
});
