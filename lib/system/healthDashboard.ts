export type ServiceHealth = {
  name?: string | null;
  healthy?: boolean | null;
  latencyMs?: number | null;
  critical?: boolean | null;
};

export type SystemHealthInput = {
  services?: ServiceHealth[] | null;
};

export type SystemHealthResult =
  | {
      ok: true;
      dashboard: {
        totalServices: number;
        healthyServices: number;
        degradedServices: number;
        criticalFailures: number;
        avgLatencyMs: number;
        overallStatus: "healthy" | "degraded" | "critical";
      };
    }
  | { ok: false; reason: string };

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function buildSystemHealthDashboard(
  input: SystemHealthInput
): SystemHealthResult {
  const services = Array.isArray(input.services) ? input.services : [];
  if (services.length === 0) return { ok: false, reason: "missing_services" };

  const normalized = services.map((s) => {
    const name = typeof s.name === "string" ? s.name.trim() : "";
    const healthy = Boolean(s.healthy);
    const critical = Boolean(s.critical);
    const latencyMs =
      typeof s.latencyMs === "number" && Number.isFinite(s.latencyMs) && s.latencyMs >= 0
        ? s.latencyMs
        : NaN;

    return { name, healthy, critical, latencyMs };
  });

  if (normalized.some((s) => !s.name)) return { ok: false, reason: "invalid_service_name" };
  if (normalized.some((s) => !Number.isFinite(s.latencyMs))) {
    return { ok: false, reason: "invalid_latency" };
  }

  const totalServices = normalized.length;
  const healthyServices = normalized.filter((s) => s.healthy).length;
  const degradedServices = normalized.filter((s) => !s.healthy).length;
  const criticalFailures = normalized.filter((s) => s.critical && !s.healthy).length;
  const avgLatencyMs = round2(
    normalized.reduce((sum, s) => sum + s.latencyMs, 0) / totalServices
  );

  let overallStatus: "healthy" | "degraded" | "critical" = "healthy";
  if (criticalFailures > 0) overallStatus = "critical";
  else if (degradedServices > 0) overallStatus = "degraded";

  return {
    ok: true,
    dashboard: {
      totalServices,
      healthyServices,
      degradedServices,
      criticalFailures,
      avgLatencyMs,
      overallStatus,
    },
  };
}
