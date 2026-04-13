export type StabilityGateInput = {
  avgTTFBMs?: number | null;
  errorRatePct?: number | null;
  cacheHitRate?: number | null;
  healthPassRate?: number | null;
};

export type StabilityGateResult =
  | {
      ok: true;
      gate: {
        passed: boolean;
        avgTTFBMs: number;
        errorRatePct: number;
        cacheHitRate: number;
        healthPassRate: number;
      };
    }
  | { ok: false; reason: string };

export function evaluateSoftlaunchStabilityGate(
  input: StabilityGateInput
): StabilityGateResult {
  const avgTTFBMs =
    typeof input.avgTTFBMs === "number" && Number.isFinite(input.avgTTFBMs)
      ? input.avgTTFBMs
      : NaN;
  const errorRatePct =
    typeof input.errorRatePct === "number" && Number.isFinite(input.errorRatePct)
      ? input.errorRatePct
      : NaN;
  const cacheHitRate =
    typeof input.cacheHitRate === "number" && Number.isFinite(input.cacheHitRate)
      ? input.cacheHitRate
      : NaN;
  const healthPassRate =
    typeof input.healthPassRate === "number" && Number.isFinite(input.healthPassRate)
      ? input.healthPassRate
      : NaN;

  if (!Number.isFinite(avgTTFBMs) || avgTTFBMs < 0) {
    return { ok: false, reason: "invalid_avg_ttfb" };
  }
  if (!Number.isFinite(errorRatePct) || errorRatePct < 0 || errorRatePct > 100) {
    return { ok: false, reason: "invalid_error_rate" };
  }
  if (!Number.isFinite(cacheHitRate) || cacheHitRate < 0 || cacheHitRate > 1) {
    return { ok: false, reason: "invalid_cache_hit_rate" };
  }
  if (!Number.isFinite(healthPassRate) || healthPassRate < 0 || healthPassRate > 1) {
    return { ok: false, reason: "invalid_health_pass_rate" };
  }

  const passed =
    avgTTFBMs <= 400 &&
    errorRatePct <= 1 &&
    cacheHitRate >= 0.5 &&
    healthPassRate >= 0.98;

  return {
    ok: true,
    gate: {
      passed,
      avgTTFBMs,
      errorRatePct,
      cacheHitRate,
      healthPassRate,
    },
  };
}
