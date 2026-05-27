export type ZenScoreInput = {
  presenceDepth: number;
  resonance: number;
  drift: number;
  legacyBonus?: number;
};

export function calculateZenScore(input: ZenScoreInput) {
  const base =
    input.presenceDepth * 0.45 +
    input.resonance * 0.35 -
    input.drift * 0.3 +
    (input.legacyBonus || 0) * 0.1;

  return clamp01(base);
}

export function applyZenScoreEma(input: {
  previousScore: number;
  newScore: number;
  alpha?: number;
}) {
  const alpha = input.alpha ?? 0.08;
  return clamp01(input.previousScore * (1 - alpha) + input.newScore * alpha);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}
