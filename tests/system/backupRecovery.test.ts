import { describe, expect, it } from "vitest";
import { buildBackupSnapshot } from "@/lib/system/backupRecovery";

describe("backup & recovery basics", () => {
  it("creates a valid recoverable snapshot", () => {
    const out = buildBackupSnapshot({
      snapshotId: "snap_1",
      entity: "wallet-ledger",
      checksum: "a1b2c3d4e5f6a7b8",
      createdAt: 1700000000000,
      sizeBytes: 4096,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.snapshot.snapshotId).toBe("snap_1");
      expect(out.snapshot.recoverable).toBe(true);
      expect(out.snapshot.checksum).toBe("a1b2c3d4e5f6a7b8");
    }
  });

  it("rejects missing snapshot id", () => {
    const out = buildBackupSnapshot({
      snapshotId: " ",
      entity: "wallet-ledger",
      checksum: "a1b2c3d4",
      createdAt: 1700000000000,
      sizeBytes: 1024,
    });

    expect(out).toEqual({ ok: false, reason: "missing_snapshot_id" });
  });

  it("rejects invalid checksum", () => {
    const out = buildBackupSnapshot({
      snapshotId: "snap_2",
      entity: "wallet-ledger",
      checksum: "not-valid",
      createdAt: 1700000000000,
      sizeBytes: 1024,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_checksum" });
  });

  it("rejects invalid createdAt", () => {
    const out = buildBackupSnapshot({
      snapshotId: "snap_3",
      entity: "wallet-ledger",
      checksum: "abcdef12",
      createdAt: 0,
      sizeBytes: 1024,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_created_at" });
  });

  it("rejects invalid sizeBytes", () => {
    const out = buildBackupSnapshot({
      snapshotId: "snap_4",
      entity: "wallet-ledger",
      checksum: "abcdef12",
      createdAt: 1700000000000,
      sizeBytes: 0,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_size_bytes" });
  });
});
