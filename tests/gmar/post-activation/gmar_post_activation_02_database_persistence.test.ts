import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";
import { createGmarZencoinWallet } from "@/src/core/gmar/economy-active/zencoin";

import {
  createGmarPersistedSnapshot,
  restoreGmarPersistedSnapshot,
  assertGmarPersistedSnapshot
} from "@/src/core/gmar/persistence-active/persistence";

describe("GMAR Post-Activation Pack 02 — Database Persistence", () => {
  it("creates and restores persisted snapshot", () => {
    const gameState = createInitialGmarGameState({
      userId: "user_001",
      displayName: "Waqar",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    const wallet = createGmarZencoinWallet({
      playerId: gameState.player.playerId,
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    const snapshot = createGmarPersistedSnapshot({
      gameState,
      wallet,
      now: new Date("2026-05-09T00:01:00.000Z")
    });

    expect(snapshot.playerId).toBe("gmar_user_001");
    expect(snapshot.version).toBe(1);
    expect(assertGmarPersistedSnapshot(snapshot)).toBe(true);

    const restored = restoreGmarPersistedSnapshot(snapshot);

    expect(restored.gameState.player.playerId).toBe("gmar_user_001");
    expect(restored.wallet?.playerId).toBe("gmar_user_001");
  });

  it("rejects wallet mismatch", () => {
    const gameState = createInitialGmarGameState({
      userId: "user_001"
    });

    const wallet = createGmarZencoinWallet({
      playerId: "gmar_wrong_user"
    });

    expect(() =>
      createGmarPersistedSnapshot({
        gameState,
        wallet
      })
    ).toThrow("GMAR persistence wallet mismatch.");
  });

  it("rejects unsupported snapshot version", () => {
    const gameState = createInitialGmarGameState({
      userId: "user_001"
    });

    const snapshot = createGmarPersistedSnapshot({
      gameState
    });

    expect(() =>
      restoreGmarPersistedSnapshot({
        ...snapshot,
        version: 99 as 1
      })
    ).toThrow("Unsupported GMAR persistence snapshot version.");
  });
});
