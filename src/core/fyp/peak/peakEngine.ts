export interface PeakCard {
  id: string;
  emotionalApex: boolean;
  replayLocked: boolean;
}

export function generatePeakCard(id: string): PeakCard {
  return {
    id,
    emotionalApex: true,
    replayLocked: true
  };
}
