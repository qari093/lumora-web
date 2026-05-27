import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";
import { createGmarZencoinWallet } from "@/src/core/gmar/economy-active/zencoin";
import { createGmarReadinessReport } from "@/src/core/gmar/infra-active/readiness";

export type GmarDashboardState = {
  playerId: string;
  displayName: string;
  level: number;
  xp: number;
  zencoinBalance: number;
  activeMissionTitle: string;
  activeWorld: string;
  activeZone: string;
  playable: boolean;
  readiness: "ready" | "degraded";
};

export function createGmarDashboardState(input: {
  userId: string;
  displayName?: string;
}): GmarDashboardState {
  const gameState = createInitialGmarGameState({
    userId: input.userId,
    displayName: input.displayName
  });

  const wallet = createGmarZencoinWallet({
    playerId: gameState.player.playerId
  });

  const readiness = createGmarReadinessReport();

  return {
    playerId: gameState.player.playerId,
    displayName: gameState.player.displayName,
    level: gameState.player.level,
    xp: gameState.player.xp,
    zencoinBalance: wallet.balance,
    activeMissionTitle: gameState.missions[0]?.title ?? "No mission",
    activeWorld: gameState.world.worldId,
    activeZone: gameState.world.zoneId,
    playable: readiness.ok,
    readiness: readiness.status
  };
}

export function assertGmarDashboardState(state: GmarDashboardState): true {
  if (
    !state.playerId ||
    !state.displayName ||
    state.level < 1 ||
    state.xp < 0 ||
    state.zencoinBalance < 0 ||
    state.playable !== true ||
    state.readiness !== "ready"
  ) {
    throw new Error("Invalid GMAR dashboard state.");
  }

  return true;
}
