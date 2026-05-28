export type ResonanceSignal = {
  creatorId: string;
  replayDepth: number;
  emotionalImpact: number;
  publicCountersVisible: false;
};

export function createResonanceSignal(
  creatorId: string,
  replayDepth: number
): ResonanceSignal {
  return {
    creatorId,
    replayDepth,
    emotionalImpact: Math.min(100, replayDepth * 14),
    publicCountersVisible: false
  };
}
