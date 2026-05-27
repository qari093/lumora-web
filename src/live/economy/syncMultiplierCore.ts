export type SyncMultiplier = {
  roomId: string;
  multiplier: 1 | 2;
  durationSeconds: number;
};

export function createSyncMultiplier(roomId: string): SyncMultiplier {
  return {
    roomId,
    multiplier: 2,
    durationSeconds: 30,
  };
}
