export type PeakCard = {
  id: string;
  title: string;
  gifted: boolean;
  replayLocked: boolean;
};

export function createPeakCard(id: string): PeakCard {
  return {
    id,
    title: "Peak Moment",
    gifted: false,
    replayLocked: true
  };
}

export function giftPeakCard(card: PeakCard): PeakCard {
  return {
    ...card,
    gifted: true
  };
}
