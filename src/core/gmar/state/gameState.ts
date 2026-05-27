export type GameState = {
  playerId: string;
  level: number;
  xp: number;
  hp: number;
  zone: string;
};

export function createInitialState(playerId: string): GameState {
  return {
    playerId,
    level: 1,
    xp: 0,
    hp: 100,
    zone: "origin"
  };
}

// -----------------------------------------------------------------------------
// GMAR compatibility exports — required by app/api/gmar/state/init,
// dashboard-active, and onboarding.
// -----------------------------------------------------------------------------
export type GmarGameState = {
  userId: string;
  playerId: string;
  player: {
    playerId: string;
    userId: string;
    displayName: string;
  };
  status: "initialized";
  createdAt: string;
  updatedAt: string;
  version: 1;
};

export function createInitialGmarGameState(input: unknown = "anonymous"): GmarGameState {
  const now = new Date().toISOString();
  const safePlayerId = normalizeGmarPlayerId(input);

  return {
    userId: safePlayerId,
    playerId: safePlayerId,
    player: {
      playerId: safePlayerId,
      userId: safePlayerId,
      displayName: "GMAR Player"
    },
    status: "initialized",
    createdAt: now,
    updatedAt: now,
    version: 1
  };
}

function normalizeGmarPlayerId(input: unknown): string {
  if (typeof input === "string" && input.trim().length > 0) {
    return input.trim();
  }

  if (input && typeof input === "object") {
    const obj = input as {
      userId?: unknown;
      playerId?: unknown;
      player?: { playerId?: unknown; userId?: unknown };
    };

    if (typeof obj.playerId === "string" && obj.playerId.trim().length > 0) return obj.playerId.trim();
    if (typeof obj.userId === "string" && obj.userId.trim().length > 0) return obj.userId.trim();
    if (typeof obj.player?.playerId === "string" && obj.player.playerId.trim().length > 0) return obj.player.playerId.trim();
    if (typeof obj.player?.userId === "string" && obj.player.userId.trim().length > 0) return obj.player.userId.trim();
  }

  return "anonymous";
}

export function assertGmarGameState(value: unknown): asserts value is GmarGameState {
  if (!value || typeof value !== "object") {
    throw new Error("invalid_gmar_game_state");
  }

  const state = value as Partial<GmarGameState>;

  if (
    typeof state.userId !== "string" ||
    typeof state.playerId !== "string" ||
    typeof state.player !== "object" ||
    state.player === null ||
    typeof (state.player as { playerId?: unknown }).playerId !== "string" ||
    state.status !== "initialized" ||
    typeof state.createdAt !== "string" ||
    typeof state.updatedAt !== "string" ||
    state.version !== 1
  ) {
    throw new Error("invalid_gmar_game_state");
  }
}
