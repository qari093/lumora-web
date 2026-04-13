export type EndpointMetric = {
  path?: string | null;
  ttfbMs?: number | null;
  cacheHit?: boolean | null;
};

export type PerformanceInput = {
  endpoints?: EndpointMetric[] | null;
};

export type PerformanceResult =
  | {
      ok: true;
      summary: {
        totalEndpoints: number;
        avgTTFB: number;
        slowEndpoints: number;
        cacheHitRate: number;
        status: "optimal" | "degraded";
      };
    }
  | { ok: false; reason: string };

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function evaluatePerformance(input: PerformanceInput): PerformanceResult {
  const endpoints = Array.isArray(input.endpoints) ? input.endpoints : [];
  if (endpoints.length === 0) return { ok: false, reason: "missing_endpoints" };

  const normalized = endpoints.map((e) => {
    const path = typeof e.path === "string" ? e.path.trim() : "";
    const ttfb =
      typeof e.ttfbMs === "number" && Number.isFinite(e.ttfbMs) && e.ttfbMs >= 0
        ? e.ttfbMs
        : NaN;
    const cacheHit = Boolean(e.cacheHit);

    return { path, ttfb, cacheHit };
  });

  if (normalized.some((e) => !e.path)) return { ok: false, reason: "invalid_path" };
  if (normalized.some((e) => !Number.isFinite(e.ttfb))) return { ok: false, reason: "invalid_ttfb" };

  const totalEndpoints = normalized.length;
  const avgTTFB = round2(normalized.reduce((sum, e) => sum + e.ttfb, 0) / totalEndpoints);
  const slowEndpoints = normalized.filter((e) => e.ttfb > 500).length;
  const cacheHits = normalized.filter((e) => e.cacheHit).length;
  const cacheHitRate = round2(cacheHits / totalEndpoints);

  const status = avgTTFB <= 300 && cacheHitRate >= 0.5 ? "optimal" : "degraded";

  return {
    ok: true,
    summary: {
      totalEndpoints,
      avgTTFB,
      slowEndpoints,
      cacheHitRate,
      status,
    },
  };
}
