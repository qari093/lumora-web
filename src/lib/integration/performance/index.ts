export function optimizeFypRenderingPipeline(items: unknown[], limit = 12) {
  return { items: items.slice(0, limit), virtualized: true };
}

export function reduceMemoryFootprint(input: { activePlayers: number; maxPlayers?: number }) {
  const maxPlayers = input.maxPlayers ?? 3;
  return { activePlayers: Math.min(input.activePlayers, maxPlayers), capped: input.activePlayers > maxPlayers };
}

export function addRuntimeCache<T>(key: string, value: T) {
  return { key, value, cached: true, ttlMs: 30000 };
}

export function batchApiPayload<T>(items: T[], batchSize = 25) {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) batches.push(items.slice(i, i + batchSize));
  return batches;
}

export function validateLatencyTarget(input: { latencyMs: number; targetMs?: number }) {
  const targetMs = input.targetMs ?? 200;
  return { ok: input.latencyMs <= targetMs, latencyMs: input.latencyMs, targetMs };
}
