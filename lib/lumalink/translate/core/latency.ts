/**
 * Simple latency guard:
 * - Drops output audio/captions if they arrive too late relative to input time.
 * - Designed to keep conversational UX stable under provider stalls.
 */
export function withinLatency(nowMs: number, tMs: number, maxLatencyMs: number): boolean {
  return (nowMs - tMs) <= maxLatencyMs;
}

/**
 * Latency defaults (ms)
 * Keep conservative for real-time voice/video translation to avoid runaway buffering.
 */
export function defaultLatencyBudgetMs(): number {
  return 900; // default end-to-end budget target (ms)
}

/**
 * Clamp latency budget into safe operating bounds.
 */
export function clampLatencyBudgetMs(v?: number): number {
  const n = typeof v === "number" && Number.isFinite(v) ? v : defaultLatencyBudgetMs();
  const min = 250;
  const max = 2500;
  return Math.max(min, Math.min(max, Math.round(n)));
}

