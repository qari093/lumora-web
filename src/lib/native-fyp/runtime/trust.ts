export function adjustTrustScore(current: number, failed: boolean): number {
  if (failed) return Math.max(0, current - 0.1);
  return Math.min(1, current + 0.01);
}
