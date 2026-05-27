export type InfraTier = "edge" | "worker" | "batch" | "deferred";
export type FeatureClass = "dashboard" | "whisper" | "constellation" | "economy" | "mythic";

export interface BatchJob {
  id: string;
  feature: FeatureClass;
  tier: InfraTier;
  priority: number;
  estimatedCostUnits: number;
}

export interface CostGovernorInput {
  dailyBudgetUnits: number;
  usedUnits: number;
  requestedUnits: number;
  feature: FeatureClass;
}

export interface CostGovernorDecision {
  allowed: boolean;
  tier: InfraTier;
  reason: string;
}

export interface RateLimitInput {
  feature: FeatureClass;
  eventsThisWindow: number;
  windowLimit: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
}

export interface CachePolicy {
  key: string;
  ttlSeconds: number;
  staleWhileRevalidateSeconds: number;
}
