export type InvisibleValueSignal = {
  type: "deep-engagement" | "quiet-resonance";
  creatorId: string;
  witnessId: string;
  weight: number;
};

export function calculateInvisibleValue(signals: InvisibleValueSignal[]) {
  const score = signals.reduce((sum, signal) => sum + Math.max(0, signal.weight), 0);

  return {
    signalCount: signals.length,
    invisibleValueScore: score,
    publicScoreVisible: false,
  };
}
