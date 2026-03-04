export type StormLevel = 0 | 1 | 2 | 3;

export type StormSignal = Readonly<{
  uploadsLastHour: number;
  viewsLastHour: number;
  p95EdgeMs: number;
  errorRate: number; // 0..1
  queueDepth: number;
}>;

export type StormConfig = Readonly<{
  // thresholds (conservative, tunable)
  level1Uploads: number;
  level2Uploads: number;
  level3Uploads: number;

  level1Views: number;
  level2Views: number;
  level3Views: number;

  maxP95EdgeMs: number;
  maxErrorRate: number;
  maxQueueDepth: number;

  // gating: if true, levels >0 require explicit operator confirmation
  requireOperatorConfirm: boolean;
}>;

export const DEFAULT_STORM_CONFIG: StormConfig = Object.freeze({
  level1Uploads: 250,
  level2Uploads: 800,
  level3Uploads: 2000,

  level1Views: 15000,
  level2Views: 60000,
  level3Views: 180000,

  maxP95EdgeMs: 80,
  maxErrorRate: 0.02,
  maxQueueDepth: 5000,

  requireOperatorConfirm: true,
});

export type StormAssessment = Readonly<{
  computedLevel: StormLevel;
  activeLevel: StormLevel; // after operator gating
  needsOperatorConfirm: boolean;
  reasons: ReadonlyArray<string>;
}>;

function clampLevel(n: number): StormLevel {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  return 3;
}

function maxLevelFromThreshold(value: number, t1: number, t2: number, t3: number): StormLevel {
  if (value >= t3) return 3;
  if (value >= t2) return 2;
  if (value >= t1) return 1;
  return 0;
}

/**
 * Storms = growth shock staging.
 * Rule: never auto-escalate into higher-cost modes unless operator confirmed (when enabled).
 */
export function assessStorm(
  signal: StormSignal,
  config: StormConfig = DEFAULT_STORM_CONFIG,
  operatorConfirmedLevel?: StormLevel
): StormAssessment {
  const reasons: string[] = [];

  const ul = maxLevelFromThreshold(signal.uploadsLastHour, config.level1Uploads, config.level2Uploads, config.level3Uploads);
  const vl = maxLevelFromThreshold(signal.viewsLastHour, config.level1Views, config.level2Views, config.level3Views);
  const perfLevel =
    signal.p95EdgeMs > config.maxP95EdgeMs || signal.errorRate > config.maxErrorRate || signal.queueDepth > config.maxQueueDepth
      ? 1
      : 0;

  if (ul > 0) reasons.push(`uploads_level_${ul}`);
  if (vl > 0) reasons.push(`views_level_${vl}`);
  if (perfLevel > 0) {
    if (signal.p95EdgeMs > config.maxP95EdgeMs) reasons.push("p95_edge_ms_high");
    if (signal.errorRate > config.maxErrorRate) reasons.push("error_rate_high");
    if (signal.queueDepth > config.maxQueueDepth) reasons.push("queue_depth_high");
  }

  const computed = clampLevel(Math.max(ul, vl, perfLevel));

  if (!config.requireOperatorConfirm) {
    return {
      computedLevel: computed,
      activeLevel: computed,
      needsOperatorConfirm: false,
      reasons,
    };
  }

  const confirmed = typeof operatorConfirmedLevel === "number" ? operatorConfirmedLevel : 0;
  const active = clampLevel(Math.min(computed, confirmed));

  return {
    computedLevel: computed,
    activeLevel: active,
    needsOperatorConfirm: computed > active,
    reasons,
  };
}

/**
 * Apply guardrails based on active storm level.
 * Level 0: normal
 * Level 1+: tighten defaults (no heavy compute, lower concurrency, stricter TTLs)
 */
export type StormGuards = Readonly<{
  allowExpensiveJobs: boolean;
  maxEncodeConcurrency: number;
  maxVariantCount: number;
  signedUrlMaxTtlSec: number;
  segmentUrlMaxTtlSec: number;
}>;

export function guardsForStormLevel(level: StormLevel): StormGuards {
  if (level === 0) {
    return {
      allowExpensiveJobs: true,
      maxEncodeConcurrency: 6,
      maxVariantCount: 4,
      signedUrlMaxTtlSec: 3600,
      segmentUrlMaxTtlSec: 300,
    };
  }
  if (level === 1) {
    return {
      allowExpensiveJobs: false,
      maxEncodeConcurrency: 3,
      maxVariantCount: 3,
      signedUrlMaxTtlSec: 3600,
      segmentUrlMaxTtlSec: 180,
    };
  }
  if (level === 2) {
    return {
      allowExpensiveJobs: false,
      maxEncodeConcurrency: 2,
      maxVariantCount: 2,
      signedUrlMaxTtlSec: 3600,
      segmentUrlMaxTtlSec: 120,
    };
  }
  return {
    allowExpensiveJobs: false,
    maxEncodeConcurrency: 1,
    maxVariantCount: 1,
    signedUrlMaxTtlSec: 3600,
    segmentUrlMaxTtlSec: 90,
  };
}
