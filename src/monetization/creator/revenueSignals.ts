export type CreatorRevenueSignal = {
  holdDepth: number;
  rewatchCount: number;
  completionRate: number;
  drift: number;
};

export function calculateCreatorRevenueWeight(signal: CreatorRevenueSignal) {
  const raw =
    signal.holdDepth * 0.45 +
    Math.min(1, signal.rewatchCount * 0.15) +
    signal.completionRate * 0.3 -
    signal.drift * 0.25;

  return Math.max(0, Math.min(1, raw));
}
