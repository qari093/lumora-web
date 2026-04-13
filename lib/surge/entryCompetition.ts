export type EntryCompetition = {
  id: string;
  challengeId: string;
  userId: string;
  entryFee: number;
  currency: "ZC";
  status: "entered";
  createdAt: number;
};

export function createEntryCompetition(input: {
  challengeId: string;
  userId: string;
  entryFee: number;
}): EntryCompetition {
  return {
    id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    challengeId: input.challengeId,
    userId: input.userId,
    entryFee: Math.max(0, Math.floor(input.entryFee || 0)),
    currency: "ZC",
    status: "entered",
    createdAt: Date.now(),
  };
}
