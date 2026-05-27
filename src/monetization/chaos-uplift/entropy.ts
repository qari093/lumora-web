export function calculateEmotionalTrajectoryEntropy(input: {
  distinctEmotionalStates: number;
  totalMoments: number;
}) {
  if (input.totalMoments <= 0) return 0;
  return Math.min(1, input.distinctEmotionalStates / input.totalMoments);
}
