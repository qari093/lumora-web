import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";
import { createGmarZencoinWallet } from "@/src/core/gmar/economy-active/zencoin";

import {
  createGmarDatabaseRecord,
  restoreGmarDatabaseRecord,
  assertGmarDatabaseRecord
} from "@/src/core/gmar/final-completion/database/databasePersistence";

describe("GMAR Final Completion Phase 01 — Real Database Persistence", () => {
  it("creates and restores GMAR database record", () => {
    const gameState = createInitialGmarGameState({
      userId: "user_001",
      displayName: "Waqar",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    const wallet = createGmarZencoinWallet({
      playerId: gameState.player.playerId,
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    const record = createGmarDatabaseRecord({
      gameState,
      wallet,
      now: new Date("2026-05-09T00:01:00.000Z")
    });

    expect(record.id).toBe("gmar_db_gmar_user_001");
    expect(record.playerId).toBe("gmar_user_001");
    expect(record.userId).toBe("user_001");
    expect(record.schemaVersion).toBe(1);
    expect(record.migrationReady).toBe(true);
    expect(record.recoveryReady).toBe(true);
    expect(assertGmarDatabaseRecord(record)).toBe(true);

    const restored = restoreGmarDatabaseRecord(record);

    expect(restored.gameState.player.playerId).toBe("gmar_user_001");
    expect(restored.wallet?.playerId).toBe("gmar_user_001");
  });

  it("rejects wallet mismatch", () => {
    const gameState = createInitialGmarGameState({
      userId: "user_001"
    });

    const wallet = createGmarZencoinWallet({
      playerId: "gmar_wrong"
    });

    expect(() =>
      createGmarDatabaseRecord({
        gameState,
        wallet
      })
    ).toThrow("GMAR database wallet mismatch.");
  });

  it("rejects unsupported schema version", () => {
    const gameState = createInitialGmarGameState({
      userId: "user_001"
    });

    const record = createGmarDatabaseRecord({
      gameState
    });

    expect(() =>
      restoreGmarDatabaseRecord({
        ...record,
        schemaVersion: 99 as 1
      })
    ).toThrow("Unsupported GMAR database schema version.");
  });
});
