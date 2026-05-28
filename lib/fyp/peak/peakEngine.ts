export type PeakCard = {
  id: string;
  giftedToVault: boolean;
  replayLockedDuringSession: boolean;
};

export function createPeakCard(id = "peak-card"): PeakCard {
  return { id, giftedToVault: true, replayLockedDuringSession: true };
}
