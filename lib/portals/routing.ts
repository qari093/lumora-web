import type { PortalKey } from "@/lib/portals/activation";

export type PortalRouteMap = Record<PortalKey, string>;

export type PortalRoutingInput = {
  enabledPortals?: PortalKey[] | null;
  routeMap?: Partial<PortalRouteMap> | null;
};

export type PortalRoutingResult =
  | {
      ok: true;
      routes: { key: PortalKey; path: string; enabled: boolean }[];
    }
  | { ok: false; reason: string };

const DEFAULT_ROUTE_MAP: PortalRouteMap = {
  FYP: "/fyp",
  LIVE: "/live",
  GMAR: "/gmar",
  NEXA: "/nexa",
  MOVIES: "/movies",
  MUSIC: "/music",
};

const ALL_PORTALS: PortalKey[] = ["FYP", "LIVE", "GMAR", "NEXA", "MOVIES", "MUSIC"];

export function resolvePortalRouting(input: PortalRoutingInput): PortalRoutingResult {
  const enabled = new Set<PortalKey>(Array.isArray(input.enabledPortals) ? input.enabledPortals : []);
  const routeMap: PortalRouteMap = {
    ...DEFAULT_ROUTE_MAP,
    ...(input.routeMap || {}),
  };

  const paths = new Set<string>();
  for (const key of ALL_PORTALS) {
    const path = routeMap[key];
    if (!path || typeof path !== "string" || !path.startsWith("/")) {
      return { ok: false, reason: "invalid_route_path" };
    }
    if (paths.has(path)) {
      return { ok: false, reason: "duplicate_route_path" };
    }
    paths.add(path);
  }

  return {
    ok: true,
    routes: ALL_PORTALS.map((key) => ({
      key,
      path: routeMap[key],
      enabled: enabled.has(key),
    })),
  };
}
