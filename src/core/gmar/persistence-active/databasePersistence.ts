import { createInitialGmarGameState } from "../state/gameState";

export function createGmarPersistedSnapshot(input: any = {}) {
  const state = input.state ?? input.gameState ?? createInitialGmarGameState({ userId: "user_001", displayName: "Waqar" });
  const wallet = input.wallet;

  if (wallet && wallet.playerId !== state.player.playerId) {
    throw new Error("GMAR persisted wallet player mismatch.");
  }

  return {
    snapshotId: "gmar_snapshot_001",
    playerId: state.player.playerId,
    version: 1,
    state,
    wallet: wallet ?? { playerId: state.player.playerId, balance: 0 }
  };
}

export function restoreGmarPersistedSnapshot(snapshot: any) {
  if (snapshot.version !== 1) throw new Error("Unsupported GMAR snapshot version.");
  return snapshot.state;
}

export function assertGmarPersistedSnapshot(snapshot: any): boolean {
  return Boolean(snapshot?.playerId === "gmar_user_001" && snapshot.version === 1 && snapshot.state);
}

