import type { GmarGameState } from "@/src/core/gmar/state/gameState";

const SUPPORTED_SCHEMA_VERSION = 1 as const;

export type GmarDatabaseInput = {
  userId?: string;
  playerId?: string;
  gameState?: any;
  wallet?: any;
  now?: Date;
};

export type GmarDatabaseRecord = {
  id: string;
  playerId: string;
  userId: string;
  gameState: any;
  wallet?: any;
  schemaVersion: typeof SUPPORTED_SCHEMA_VERSION;
  migrationReady: boolean;
  recoveryReady: boolean;
  createdAt: string;
  updatedAt: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function findStringKey(obj: unknown, key: string): string {
  if (!obj || typeof obj !== "object") return "";
  const seen = new Set<object>();
  const stack: any[] = [obj];

  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object" || seen.has(cur)) continue;
    seen.add(cur);

    if (typeof cur[key] === "string" && cur[key].trim()) return cur[key].trim();

    for (const v of Object.values(cur)) {
      if (v && typeof v === "object") stack.push(v);
    }
  }

  return "";
}

function pickUserId(input: GmarDatabaseInput): string {
  const value =
    str(input.userId) ||
    str(input.gameState?.userId) ||
    str(input.gameState?.player?.userId) ||
    str(input.gameState?.player?.id) ||
    findStringKey(input.gameState, "userId");

  if (!value) throw new Error("GMAR database user id is required.");
  return value;
}

function canonicalPlayerId(raw: string, userId: string): string {
  if (raw.startsWith("gmar_")) return raw;
  return `gmar_${userId}`;
}

function walletPlayerId(wallet: unknown): string {
  return (
    str((wallet as any)?.playerId) ||
    str((wallet as any)?.player?.playerId) ||
    findStringKey(wallet, "playerId")
  );
}

function normalizeWallet(wallet: any, playerId: string): any {
  if (!wallet) return undefined;
  return { ...wallet, playerId };
}

function normalizeGameState(gameState: any, userId: string, playerId: string): any {
  const base = gameState && typeof gameState === "object" ? gameState : {};
  const player = base.player && typeof base.player === "object" ? base.player : {};

  return {
    ...base,
    userId: str(base.userId) || userId,
    playerId,
    player: {
      ...player,
      userId,
      playerId
    }
  };
}

export function createGmarDatabaseRecord(input: GmarDatabaseInput): GmarDatabaseRecord {
  const userId = pickUserId(input);
  const rawPlayer =
    str(input.playerId) ||
    str(input.gameState?.player?.playerId) ||
    str(input.gameState?.playerId) ||
    "";

  const playerId = canonicalPlayerId(rawPlayer, userId);
  const wPlayer = walletPlayerId(input.wallet);

  if (input.wallet && wPlayer.startsWith("gmar_") && wPlayer !== playerId) {
    throw new Error("GMAR database wallet mismatch.");
  }

  const now = (input.now ?? new Date()).toISOString();

  return {
    id: `gmar_db_${playerId}`,
    playerId,
    userId,
    gameState: normalizeGameState(input.gameState, userId, playerId),
    wallet: normalizeWallet(input.wallet, playerId),
    schemaVersion: SUPPORTED_SCHEMA_VERSION,
    migrationReady: true,
    recoveryReady: true,
    createdAt: now,
    updatedAt: now
  };
}

export function restoreGmarDatabaseRecord(input: GmarDatabaseRecord): GmarDatabaseRecord {
  if (input.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    throw new Error("Unsupported GMAR database schema version.");
  }

  const playerId = canonicalPlayerId(str(input.playerId) || str(input.id).replace(/^gmar_db_/, ""), input.userId);
  const userId = str(input.userId) || playerId.replace(/^gmar_/, "");

  return {
    ...input,
    id: `gmar_db_${playerId}`,
    playerId,
    userId,
    gameState: normalizeGameState(input.gameState, userId, playerId),
    wallet: normalizeWallet(input.wallet, playerId),
    schemaVersion: SUPPORTED_SCHEMA_VERSION,
    migrationReady: true,
    recoveryReady: true
  };
}

export function assertGmarDatabaseRecord(input: GmarDatabaseRecord): boolean {
  return Boolean(
    input &&
      input.schemaVersion === SUPPORTED_SCHEMA_VERSION &&
      input.id === `gmar_db_${input.playerId}` &&
      input.playerId.startsWith("gmar_") &&
      input.userId &&
      input.migrationReady === true &&
      input.recoveryReady === true
  );
}

export function restoreGmarDatabasePersistence(input: GmarDatabaseRecord): GmarDatabaseRecord {
  return restoreGmarDatabaseRecord(input);
}

export function createGmarDatabasePersistenceRecord(input: GmarDatabaseInput): GmarDatabaseRecord {
  return createGmarDatabaseRecord(input);
}

export const GMAR_DATABASE_SCHEMA_VERSION = SUPPORTED_SCHEMA_VERSION;
