export type PortalHealthItem = {
  portal: "FYP" | "LIVE" | "GMAR" | "NEXA" | "MOVIES" | "MUSIC";
  pageOk: boolean;
  apiOk: boolean;
};

export type PortalHealthSweepInput = {
  portals?: PortalHealthItem[] | null;
};

export type PortalHealthSweepResult =
  | {
      ok: true;
      sweep: {
        checked: number;
        healthy: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

const VALID_PORTALS = new Set(["FYP", "LIVE", "GMAR", "NEXA", "MOVIES", "MUSIC"]);

export function evaluatePortalHealthSweep(
  input: PortalHealthSweepInput
): PortalHealthSweepResult {
  const portals = Array.isArray(input.portals) ? input.portals : [];
  if (portals.length === 0) return { ok: false, reason: "missing_portals" };

  const seen = new Set<string>();
  for (const item of portals) {
    if (!VALID_PORTALS.has(item.portal)) return { ok: false, reason: "invalid_portal" };
    if (seen.has(item.portal)) return { ok: false, reason: "duplicate_portal" };
    seen.add(item.portal);
  }

  const healthy = portals.filter((x) => x.pageOk && x.apiOk).length;

  return {
    ok: true,
    sweep: {
      checked: portals.length,
      healthy,
      ready: healthy === portals.length,
    },
  };
}
