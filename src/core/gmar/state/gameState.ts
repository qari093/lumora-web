export type GmarGameState = {
  player: { userId: string; playerId: string; displayName: string; xp: number; level: number };
  inventory: Array<{ itemId: string; quantity: number; equipped?: boolean; stackable?: boolean; rarity?: string; category?: string }>;
  missions: Array<{ missionId: string; title: string; completed: boolean; rewardClaimed: boolean }>;
  rewards: Array<{ id: string; type: string; amount: number }>;
  world: { worldId: string; zoneId: string; eventId: string; active: boolean };
};

function readUserId(input: unknown): string {
  if (typeof input === "string") return input.trim();
  if (input && typeof input === "object") {
    const x = input as any;
    return String(x.userId ?? x.playerId ?? x.player?.userId ?? x.player?.playerId ?? "").trim();
  }
  return "";
}

export function normalizeGmarPlayerId(input: unknown): string {
  const userId = readUserId(input);
  if (!userId) throw new Error("GMAR player userId is required.");
  return userId.startsWith("gmar_") ? userId : `gmar_${userId}`;
}

export function createInitialGmarGameState(input: { userId?: string; displayName?: string } | string = { userId: "user_001", displayName: "Waqar" }): GmarGameState {
  const userId = readUserId(input);
  if (!userId) throw new Error("GMAR player userId is required.");
  const displayName = typeof input === "object" && input && (input as any).displayName ? String((input as any).displayName) : "Waqar";

  return {
    player: { userId, playerId: normalizeGmarPlayerId(userId), displayName, xp: 0, level: 1 },
    inventory: [{ itemId: "starter_pulse_blade", quantity: 1, equipped: true, stackable: false, rarity: "common", category: "weapon" }],
    missions: [{ missionId: "first_signal", title: "First Signal", completed: false, rewardClaimed: false }],
    rewards: [],
    world: { worldId: "gmar_origin_realm", zoneId: "arrival_gate", eventId: "origin_storm", active: true }
  };
}

export function assertGmarGameState(state: any): boolean {
  return Boolean(state?.player?.playerId === "gmar_user_001" && state?.inventory?.[0]?.equipped === true && state?.world?.worldId === "gmar_origin_realm");
}

export const createGmarGameState = createInitialGmarGameState;
export const createInitialGameState = createInitialGmarGameState;

