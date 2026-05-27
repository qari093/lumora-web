export function antiCheat(score: number) {
  return {
    suspicious: score > 1000
  };
}
