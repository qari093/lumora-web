export function calculateNoveltyScore(input: {
  visualNovelty: number;
  emotionalEntropy: number;
  predictability: number;
}) {
  const score =
    input.visualNovelty * 0.4 +
    input.emotionalEntropy * 0.4 +
    (1 - input.predictability) * 0.2;

  return Math.max(0, Math.min(1, score));
}
