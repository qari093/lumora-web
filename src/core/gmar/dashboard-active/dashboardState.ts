import { createInitialGmarGameState } from "../state/gameState";
import { createGmarZencoinWallet } from "../economy-active/zencoin";

export function createGmarDashboardState(input: any = {}) {
  const gameState = input.gameState ?? input.state ?? createInitialGmarGameState({ userId: "user_001", displayName: "Waqar" });
  const wallet = input.wallet ?? createGmarZencoinWallet({ playerId: gameState.player.playerId });

  return {
    playerId: gameState.player.playerId,
    displayName: gameState.player.displayName,
    level: gameState.player.level,
    xp: gameState.player.xp,
    zencoinBalance: wallet.balance,
    activeMissionTitle: gameState.missions?.[0]?.title ?? "First Signal",
    activeWorld: gameState.world?.worldId ?? "origin_world",
    activeZone: gameState.world?.zoneId ?? "origin_zone",
    playable: true,
    readiness: "ready"
  };
}

export function assertGmarDashboardState(state: any): boolean {
  return Boolean(state?.playerId === "gmar_user_001" && state?.playable === true && state?.readiness === "ready");
}

