import type { CacheHealth, CreatorAlchemyObservabilitySnapshot, QueueHealth, RateLimitHealth } from "./types";
import { getCreatorAlchemyLogs } from "./logger";

export function buildQueueHealth(pending: number, maxAllowed = 100): QueueHealth {
  return { ok: pending <= maxAllowed, pending, maxAllowed };
}

export function buildCacheHealth(hitRatio: number, minHitRatio = 0.5): CacheHealth {
  return { ok: hitRatio >= minHitRatio, hitRatio, minHitRatio };
}

export function buildRateLimitHealth(remaining: number): RateLimitHealth {
  return { ok: remaining > 0, remaining };
}

export function buildObservabilitySnapshot(input: {
  pendingQueue: number;
  cacheHitRatio: number;
  rateLimitRemaining: number;
}): CreatorAlchemyObservabilitySnapshot {
  const queue = buildQueueHealth(input.pendingQueue);
  const cache = buildCacheHealth(input.cacheHitRatio);
  const rateLimit = buildRateLimitHealth(input.rateLimitRemaining);

  return {
    ok: queue.ok && cache.ok && rateLimit.ok,
    logs: getCreatorAlchemyLogs(),
    queue,
    cache,
    rateLimit
  };
}
