export type ReactionVisualScale = {
  opacity: number;
  density: number;
};

export function computeReactionVisualScale(input: {
  viewerCount?: number;
  intensity?: number;
}): ReactionVisualScale {
  const viewers = Math.max(0, input.viewerCount ?? 0);
  const intensity = Math.max(0, Math.min(1, input.intensity ?? 0));

  const opacity = Number(Math.min(0.95, 0.2 + intensity * 0.65).toFixed(3));
  const density = Number(Math.min(1, viewers / 100).toFixed(3));

  return { opacity, density };
}
