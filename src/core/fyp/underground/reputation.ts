export type UndergroundReputation = {
  userId: string;
  phantomVisits: number;
  avantGardeEchoes: number;
  gatekeeperPassesGranted: number;
  reputationScore: number;
};

export function calculateUndergroundReputation(input: {
  userId: string;
  phantomVisits: number;
  avantGardeEchoes: number;
  gatekeeperPassesGranted: number;
}): UndergroundReputation {
  if (!input.userId.trim()) {
    throw new Error("Underground reputation requires userId.");
  }

  return {
    userId: input.userId,
    phantomVisits: input.phantomVisits,
    avantGardeEchoes: input.avantGardeEchoes,
    gatekeeperPassesGranted: input.gatekeeperPassesGranted,
    reputationScore:
      input.phantomVisits * 3 +
      input.avantGardeEchoes * 5 +
      input.gatekeeperPassesGranted * 10
  };
}
