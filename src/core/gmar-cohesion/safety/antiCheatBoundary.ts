export function antiCheatBoundary(score: number) {
  return {
    suspicious: score >= 90,
    reviewOnly: true
  };
}
