import type { PortalKey } from "@/lib/portals/activation";

export type PortalHealthInput = {
  key?: PortalKey | null;
  enabled?: boolean | null;
  routeOk?: boolean | null;
  apiOk?: boolean | null;
  pageOk?: boolean | null;
  latencyMs?: number | null;
};

export type PortalHealthAggregateInput = {
  portals?: PortalHealthInput[] | null;
};

export type PortalHealthState = {
  key: PortalKey;
  enabled: boolean;
  healthy: boolean;
  routeOk: boolean;
  apiOk: boolean;
  pageOk: boolean;
  latencyMs: number;
};

export type PortalHealthAggregateResult =
  | {
      ok: true;
      summary: {
        total: number;
        enabled: number;
        healthy: number;
        degraded: number;
        avgLatencyMs: number;
      };
      portals: PortalHealthState[];
    }
  | { ok: false; reason: string };

const ALL_PORTALS: PortalKey[] = ["FYP", "LIVE", "GMAR", "NEXA", "MOVIES", "MUSIC"];

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function aggregatePortalHealth(
  input: PortalHealthAggregateInput
): PortalHealthAggregateResult {
  const portals = Array.isArray(input.portals) ? input.portals : [];
  if (portals.length === 0) return { ok: false, reason: "missing_portals" };

  const seen = new Set<string>();
  const normalized: PortalHealthState[] = [];

  for (const portal of portals) {
    const key = portal.key ?? null;
    if (!key || !ALL_PORTALS.includes(key)) {
      return { ok: false, reason: "invalid_portal_key" };
    }
    if (seen.has(key)) {
      return { ok: false, reason: "duplicate_portal_key" };
    }
    seen.add(key);

    const enabled = Boolean(portal.enabled);
    const routeOk = Boolean(portal.routeOk);
    const apiOk = Boolean(portal.apiOk);
    const pageOk = Boolean(portal.pageOk);
    const latencyMs =
      typeof portal.latencyMs === "number" && Number.isFinite(portal.latencyMs) && portal.latencyMs >= 0
        ? portal.latencyMs
        : NaN;

    if (!Number.isFinite(latencyMs)) {
      return { ok: false, reason: "invalid_latency" };
    }

    normalized.push({
      key,
      enabled,
      healthy: enabled ? routeOk && apiOk && pageOk : true,
      routeOk,
      apiOk,
      pageOk,
      latencyMs,
    });
  }

  const total = normalized.length;
  const enabled = normalized.filter((p) => p.enabled).length;
  const healthy = normalized.filter((p) => p.healthy).length;
  const degraded = normalized.filter((p) => !p.healthy).length;
  const avgLatencyMs = round2(
    normalized.reduce((sum, p) => sum + p.latencyMs, 0) / normalized.length
  );

  return {
    ok: true,
    summary: {
      total,
      enabled,
      healthy,
      degraded,
      avgLatencyMs,
    },
    portals: normalized,
  };
}
