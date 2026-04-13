export type ApiRouteCase = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  exists: boolean;
  healthy: boolean;
};

export type ApiRouteIntegrityVerificationInput = {
  routes?: ApiRouteCase[] | null;
};

export type ApiRouteIntegrityVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        existing: number;
        healthy: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

const METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

export function evaluateApiRouteIntegrityVerification(
  input: ApiRouteIntegrityVerificationInput
): ApiRouteIntegrityVerificationResult {
  const routes = Array.isArray(input.routes) ? input.routes : [];
  if (routes.length === 0) return { ok: false, reason: "missing_routes" };

  let existing = 0;
  let healthy = 0;

  for (const route of routes) {
    if (!route.path?.trim()) return { ok: false, reason: "missing_path" };
    if (!route.path.startsWith("/api/")) return { ok: false, reason: "invalid_path" };
    if (!METHODS.has(route.method)) return { ok: false, reason: "invalid_method" };

    if (route.exists) existing += 1;
    if (route.healthy) healthy += 1;
  }

  return {
    ok: true,
    verification: {
      total: routes.length,
      existing,
      healthy,
      ready: existing === routes.length && healthy === routes.length,
    },
  };
}
