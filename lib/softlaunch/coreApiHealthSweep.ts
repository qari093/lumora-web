export type ApiHealthEndpoint = {
  path: string;
  status: number;
  ok: boolean;
};

export type CoreApiHealthSweepInput = {
  endpoints?: ApiHealthEndpoint[] | null;
};

export type CoreApiHealthSweepResult =
  | {
      ok: true;
      sweep: {
        checked: number;
        healthy: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateCoreApiHealthSweep(
  input: CoreApiHealthSweepInput
): CoreApiHealthSweepResult {
  const endpoints = Array.isArray(input.endpoints) ? input.endpoints : [];
  if (endpoints.length === 0) return { ok: false, reason: "missing_endpoints" };

  for (const endpoint of endpoints) {
    if (!endpoint.path || !endpoint.path.startsWith("/api/")) {
      return { ok: false, reason: "invalid_path" };
    }
    if (!Number.isFinite(endpoint.status) || endpoint.status < 100 || endpoint.status > 599) {
      return { ok: false, reason: "invalid_status" };
    }
  }

  const healthy = endpoints.filter((x) => x.ok && x.status >= 200 && x.status < 300).length;

  return {
    ok: true,
    sweep: {
      checked: endpoints.length,
      healthy,
      ready: healthy === endpoints.length,
    },
  };
}
