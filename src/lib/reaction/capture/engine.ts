export type ReactionFrame = {
  t: number;
  intensity: number;
};

export function captureReaction(): ReactionFrame[] {
  return [
    { t: 0, intensity: 0.2 },
    { t: 500, intensity: 0.6 },
    { t: 1200, intensity: 0.9 }
  ];
}
