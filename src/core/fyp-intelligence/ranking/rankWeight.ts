export function rankWeight(signal: number, trust: number) {
  return Math.round((signal * 0.7 + trust * 0.3) * 100);
}
