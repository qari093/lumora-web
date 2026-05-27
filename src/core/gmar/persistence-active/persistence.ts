import type { GmarGameState } from "@/src/core/gmar/state/gameState";
import type { GmarZencoinWallet } from "@/src/core/gmar/economy-active/zencoin";

export type GmarPersistedSnapshot = {
  snapshotId: string;
  playerId: string;
  gameState: GmarGameState;
  wallet: GmarZencoinWallet | null;
  version: 1;
  savedAt: string;
};

export function createGmarPersistedSnapshot(input: {
  gameState: GmarGameState;
  wallet?: GmarZencoinWallet | null;
  now?: Date;
}): GmarPersistedSnapshot {
  const playerId = input.gameState.player.playerId;

  if (!playerId) {
    throw new Error("GMAR persistence requires playerId.");
  }

  if (input.wallet && input.wallet.playerId !== playerId) {
    throw new Error("GMAR persistence wallet mismatch.");
  }

  const now = input.now ?? new Date();

  return {
    snapshotId: `gmar_snapshot_${playerId}_${now.getTime()}`,
    playerId,
    gameState: input.gameState,
    wallet: input.wallet ?? null,
    version: 1,
    savedAt: now.toISOString()
  };
}

export function restoreGmarPersistedSnapshot(
  snapshot: GmarPersistedSnapshot
): {
  gameState: GmarGameState;
  wallet: GmarZencoinWallet | null;
} {
  if (snapshot.version !== 1) {
    throw new Error("Unsupported GMAR persistence snapshot version.");
  }

  if (snapshot.playerId !== snapshot.gameState.player.playerId) {
    throw new Error("GMAR persistence snapshot player mismatch.");
  }

  return {
    gameState: snapshot.gameState,
    wallet: snapshot.wallet
  };
}

export function assertGmarPersistedSnapshot(
  snapshot: GmarPersistedSnapshot
): true {
  if (
    !snapshot.snapshotId ||
    !snapshot.playerId ||
    snapshot.version !== 1 ||
    snapshot.playerId !== snapshot.gameState.player.playerId
  ) {
    throw new Error("Invalid GMAR persisted snapshot.");
  }

  return true;
}
