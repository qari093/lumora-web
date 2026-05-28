export type Afterglow = {
  id: string;
  roomId: string;
  exclusiveUntil: number;
  vaultEligible: boolean;
};

export function createAfterglow(roomId: string): Afterglow {
  return {
    id: `afterglow-${roomId}`,
    roomId,
    exclusiveUntil: Date.now() + 21600000,
    vaultEligible: true
  };
}
