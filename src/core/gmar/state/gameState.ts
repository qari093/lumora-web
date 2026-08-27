export type GmarGameState = {
  userId: string;
  playerId: string;
  status: "initialized";
  createdAt: string;
  updatedAt: string;
  version: number;
  player: {
    userId: string;
    playerId: string;
    displayName: string;
    xp: number;
    level: number;
  };
  inventory: Array<{
    itemId: string;
    quantity: number;
    equipped?: boolean;
    stackable?: boolean;
    rarity?: string;
    category?: string;
  }>;
  missions: Array<{
    missionId: string;
    title: string;
    completed: boolean;
    rewardClaimed: boolean;
  }>;
  rewards: Array<{ id: string; type: string; amount: number }>;
  world: {
    worldId: string;
    zoneId: string;
    eventId: string;
    active: boolean;
  };
};

export type GameState = GmarGameState;

export type GmarGameStateInput =
  | string
  | {
      userId?: string;
      playerId?: string;
      displayName?: string;
      now?: string | number | Date;
      player?: {
        userId?: string;
        playerId?: string;
      };
    };

function readUserId(input: unknown): string {
  if (typeof input === "string") return input.trim();

  if (input && typeof input === "object") {
    const value = input as {
      userId?: unknown;
      playerId?: unknown;
      player?: {
        userId?: unknown;
        playerId?: unknown;
      };
    };

    return String(
      value.userId ??
      value.playerId ??
      value.player?.userId ??
      value.player?.playerId ??
      ""
    ).trim();
  }

  return "";
}

function readTimestamp(input: GmarGameStateInput): string {
  if (typeof input !== "object" || input === null || input.now === undefined) {
    return new Date().toISOString();
  }

  const value = input.now;

  if (value instanceof Date) return value.toISOString();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function normalizeGmarPlayerId(input: unknown): string {
  const userId = readUserId(input);

  if (!userId) {
    throw new Error("GMAR player userId is required.");
  }

  return userId.startsWith("gmar_") ? userId : `gmar_${userId}`;
}

export function createInitialGmarGameState(
  input: GmarGameStateInput = {
    userId: "user_001",
    displayName: "Waqar",
  },
): GmarGameState {
  const userId = readUserId(input);

  if (!userId) {
    throw new Error("GMAR player userId is required.");
  }

  const displayName =
    typeof input === "object" &&
    input !== null &&
    typeof input.displayName === "string" &&
    input.displayName.trim()
      ? input.displayName.trim()
      : "Waqar";

  const timestamp = readTimestamp(input);

  return {
    userId,
    playerId: userId,
    status: "initialized",
    createdAt: timestamp,
    updatedAt: timestamp,
    version: 1,
    player: {
      userId,
      playerId: normalizeGmarPlayerId(userId),
      displayName,
      xp: 0,
      level: 1,
    },
    inventory: [
      {
        itemId: "starter_pulse_blade",
        quantity: 1,
        equipped: true,
        stackable: false,
        rarity: "common",
        category: "weapon",
      },
    ],
    missions: [
      {
        missionId: "first_signal",
        title: "First Signal",
        completed: false,
        rewardClaimed: false,
      },
    ],
    rewards: [],
    world: {
      worldId: "gmar_origin_realm",
      zoneId: "arrival_gate",
      eventId: "origin_storm",
      active: true,
    },
  };
}

export function assertGmarGameState(state: unknown): boolean {
  if (!state || typeof state !== "object") {
    throw new Error("invalid_gmar_game_state");
  }

  const value = state as Partial<GmarGameState>;

  const valid =
    typeof value.userId === "string" &&
    value.userId.length > 0 &&
    typeof value.playerId === "string" &&
    value.playerId.length > 0 &&
    value.status === "initialized" &&
    value.version === 1 &&
    typeof value.player?.userId === "string" &&
    value.player.userId.length > 0 &&
    typeof value.player?.playerId === "string" &&
    value.player.playerId.length > 0 &&
    Array.isArray(value.inventory) &&
    typeof value.world?.worldId === "string";

  if (!valid) {
    throw new Error("invalid_gmar_game_state");
  }

  return true;
}

export const createGmarGameState = createInitialGmarGameState;
export const createInitialGameState = createInitialGmarGameState;
export const createInitialState = createInitialGmarGameState;
