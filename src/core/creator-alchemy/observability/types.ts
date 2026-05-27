export interface RuntimeLog {
  id: string;
  level: "info" | "warn" | "error";
  area: string;
  message: string;
  createdAt: string;
}

export interface QueueHealth {
  ok: boolean;
  pending: number;
  maxAllowed: number;
}

export interface CacheHealth {
  ok: boolean;
  hitRatio: number;
  minHitRatio: number;
}

export interface RateLimitHealth {
  ok: boolean;
  remaining: number;
}

export interface CreatorAlchemyObservabilitySnapshot {
  ok: boolean;
  logs: RuntimeLog[];
  queue: QueueHealth;
  cache: CacheHealth;
  rateLimit: RateLimitHealth;
}
