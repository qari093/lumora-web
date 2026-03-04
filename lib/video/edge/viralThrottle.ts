export type ViralLevel = 0 | 1 | 2 | 3; // 0=OFF, 1=SOFT, 2=HARD, 3=EMERGENCY

export type ViralThrottleInput = Readonly<{
  // rolling view velocity (views/min) for the content
  viewsPerMin: number;
  // edge cache hit ratio [0..1]
  cacheHitRatio: number;
  // current daily egress usage fraction [0..1] (0.75 => 75% of budget)
  egressBudgetUsed: number;
  // server/operator confirmed max level (prevents auto-chaos)
  operatorMaxLevel: ViralLevel;
  // optional: observed segment 5xx ratio [0..1] to trigger emergency clamp
  errorRatio?: number;
}>;

export type ViralThrottleDecision = Readonly<{
  ok: true;
  computedLevel: ViralLevel;
  appliedLevel: ViralLevel; // min(computed, operatorMaxLevel)
  // max segments/sec minted for the content (edge limiter suggestion)
  maxSegmentRps: number;
  // segment TTL seconds (keep short under pressure)
  segmentTtlSec: number;
  // enable HOT aggregator levels (0=off,1=hot,2=hotset)
  hotLevel: 0 | 1 | 2;
  // human-readable reasons
  reasons: ReadonlyArray<string>;
}>;

export type ViralThrottleReject = Readonly<{
  ok: false;
  error: "input_invalid";
}>;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function normalizeViralLevel(x: unknown): ViralLevel {
  const n = typeof x === "string" ? Number(x) : (x as any);
  if (n === 3) return 3;
  if (n === 2) return 2;
  if (n === 1) return 1;
  return 0;
}

// Deterministic, conservative.
// - Never exceed operatorMaxLevel.
// - Escalate based on (views velocity) AND (egress pressure OR low cache hit).
export function decideViralThrottle(input: ViralThrottleInput): ViralThrottleDecision | ViralThrottleReject {
  if (
    !input ||
    !Number.isFinite(input.viewsPerMin) ||
    !Number.isFinite(input.cacheHitRatio) ||
    !Number.isFinite(input.egressBudgetUsed) ||
    !Number.isFinite(input.operatorMaxLevel as any)
  ) return { ok: false, error: "input_invalid" };

  const vpm = Math.max(0, input.viewsPerMin);
  const hit = clamp01(input.cacheHitRatio);
  const egress = clamp01(input.egressBudgetUsed);
  const opMax = normalizeViralLevel(input.operatorMaxLevel);

  const err = input.errorRatio == null ? 0 : clamp01(input.errorRatio);
  const reasons: string[] = [];

  // Base computed level from velocity:
  // 1: > 1k/min, 2: > 5k/min, 3: > 20k/min
  let computed: ViralLevel = 0;
  if (vpm >= 20000) computed = 3;
  else if (vpm >= 5000) computed = 2;
  else if (vpm >= 1000) computed = 1;

  // Pressure modifiers:
  // If cache hit is low (<60%), bump one level (up to 3).
  if (hit < 0.6 && computed > 0) {
    computed = (Math.min(3, computed + 1) as ViralLevel);
    reasons.push("low_cache_hit_bump");
  }

  // If egress usage high (>=85%), bump one level; if >=95%, bump two.
  if (egress >= 0.95 && computed > 0) {
    computed = (Math.min(3, computed + 2) as ViralLevel);
    reasons.push("egress_critical_bump");
  } else if (egress >= 0.85 && computed > 0) {
    computed = (Math.min(3, computed + 1) as ViralLevel);
    reasons.push("egress_high_bump");
  }

  // If error ratio high, force emergency computed=3 (but still capped by operator)
  if (err >= 0.15) {
    computed = 3;
    reasons.push("error_ratio_emergency");
  }

  const applied = (computed > opMax ? opMax : computed) as ViralLevel;
  if (computed > applied) reasons.push("operator_cap_applied");

  // Map level to operational knobs
  // segment TTL: 60s normal, 45/30/15 as pressure rises
  const segmentTtlSec = applied === 0 ? 60 : applied === 1 ? 45 : applied === 2 ? 30 : 15;

  // HOT aggregator:
  // off normally; HOT for level>=1; HOTSET for level>=2
  const hotLevel: 0 | 1 | 2 = applied >= 2 ? 2 : applied >= 1 ? 1 : 0;

  // Segment RPS:
  // conservative ceilings to prevent runaway minting
  const maxSegmentRps =
    applied === 0 ? 40 :
    applied === 1 ? 25 :
    applied === 2 ? 15 : 8;

  if (computed > 0) reasons.push(`velocity_${computed}`);

  return { ok: true, computedLevel: computed, appliedLevel: applied, maxSegmentRps, segmentTtlSec, hotLevel, reasons };
}
