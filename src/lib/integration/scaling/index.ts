export function scaleCircleWorkers(input: { activeCircles: number; workers: number; maxPerWorker?: number }) {
  const maxPerWorker = input.maxPerWorker ?? 25;
  const requiredWorkers = Math.max(1, Math.ceil(input.activeCircles / maxPerWorker));
  return { requiredWorkers, scaleUp: requiredWorkers > input.workers };
}

export function createQueueJob(type: string, payload: unknown) {
  return { id: `${type}:${Date.now()}`, type, payload, queued: true };
}

export function applyFailover(primaryOk: boolean, fallback: string) {
  return { using: primaryOk ? "primary" : fallback, failover: !primaryOk };
}

export function optimizeDbReads<T>(rows: T[], limit = 50) {
  return { rows: rows.slice(0, limit), limited: rows.length > limit };
}

export function validateHighLoad(input: { p95LatencyMs: number; errorRate: number }) {
  return { ok: input.p95LatencyMs <= 500 && input.errorRate <= 0.01 };
}
