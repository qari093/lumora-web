export type EdgeCacheRoute = {
  path: string;
  cacheMode: "edge" | "private" | "no-store";
  personalized: boolean;
  valid: boolean;
};

export type EdgeCacheVerificationInput = {
  routes?: EdgeCacheRoute[] | null;
};

export type EdgeCacheVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        valid: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateEdgeCacheVerification(
  input: EdgeCacheVerificationInput
): EdgeCacheVerificationResult {
  const routes = Array.isArray(input.routes) ? input.routes : [];
  if (routes.length === 0) return { ok: false, reason: "missing_routes" };

  let validCount = 0;

  for (const route of routes) {
    if (!route.path?.trim()) return { ok: false, reason: "missing_path" };
    if (!route.path.startsWith("/")) return { ok: false, reason: "invalid_path" };
    if (!["edge", "private", "no-store"].includes(route.cacheMode)) {
      return { ok: false, reason: "invalid_cache_mode" };
    }

    if (route.personalized && route.cacheMode === "edge") {
      return { ok: false, reason: "personalized_route_cannot_use_edge_cache" };
    }

    if (route.valid) validCount += 1;
  }

  return {
    ok: true,
    verification: {
      total: routes.length,
      valid: validCount,
      ready: validCount === routes.length,
    },
  };
}
