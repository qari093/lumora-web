export type LiveInteraction =
  | { type: "aura_beam"; roomId: string; userId: string; intensity: number }
  | { type: "spark"; roomId: string; userId: string; seconds: 9 }
  | { type: "quiet_signal"; roomId: string; userId: string };

export function normalizeAuraIntensity(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function createLiveSpark(roomId: string, userId: string): LiveInteraction {
  return { type: "spark", roomId, userId, seconds: 9 };
}
