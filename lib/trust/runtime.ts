export function trustScore(score = 0): number {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return score;
}

export default {
  trustScore
};
