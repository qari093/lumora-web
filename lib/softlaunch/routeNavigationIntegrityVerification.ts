export type NavigationRoute = {
  from: string;
  to: string;
  enabled: boolean;
  valid: boolean;
};

export type RouteNavigationIntegrityVerificationInput = {
  routes?: NavigationRoute[] | null;
};

export type RouteNavigationIntegrityVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        enabled: number;
        valid: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateRouteNavigationIntegrityVerification(
  input: RouteNavigationIntegrityVerificationInput
): RouteNavigationIntegrityVerificationResult {
  const routes = Array.isArray(input.routes) ? input.routes : [];
  if (routes.length === 0) return { ok: false, reason: "missing_routes" };

  let enabled = 0;
  let valid = 0;

  for (const route of routes) {
    if (!route.from?.trim()) return { ok: false, reason: "missing_from" };
    if (!route.to?.trim()) return { ok: false, reason: "missing_to" };
    if (!route.from.startsWith("/")) return { ok: false, reason: "invalid_from" };
    if (!route.to.startsWith("/")) return { ok: false, reason: "invalid_to" };

    if (route.enabled) enabled += 1;
    if (route.valid) valid += 1;
  }

  return {
    ok: true,
    verification: {
      total: routes.length,
      enabled,
      valid,
      ready: enabled === routes.length && valid === routes.length,
    },
  };
}
