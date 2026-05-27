export function readinessScore(scores: number[]) {
  const total = scores.reduce((sum, value) => sum + value, 0);
  const average = Math.round(total / Math.max(scores.length, 1));
  return {
    average,
    ready: average >= 90
  };
}
