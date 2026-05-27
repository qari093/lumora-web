export function trustGate(score: number) {
  return { allowed: score >= 0.55, score };
}
