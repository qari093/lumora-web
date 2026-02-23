export type PortalKey =
  | "fyp"
  | "gmar"
  | "videos"
  | "nexa"
  | "movies"
  | "live"
  | "share"
  | "celebrations";

export type PortalDef = Readonly<{
  key: PortalKey;
  route: `/${string}` | "/";
  marker: string;
}>;

export const PORTALS: ReadonlyArray<PortalDef> = Object.freeze([
  { key: "fyp", route: "/fyp", marker: "LUMORA_PORTAL_ALIVE_FYP" },
  { key: "gmar", route: "/gmar", marker: "LUMORA_PORTAL_ALIVE_GMAR" },
  { key: "videos", route: "/videos", marker: "LUMORA_PORTAL_ALIVE_VIDEOS" },
  { key: "nexa", route: "/nexa", marker: "LUMORA_PORTAL_ALIVE_NEXA" },
  { key: "movies", route: "/movies", marker: "LUMORA_PORTAL_ALIVE_MOVIES" },
  { key: "live", route: "/live", marker: "LUMORA_PORTAL_ALIVE_LIVE" },
  { key: "share", route: "/share", marker: "LUMORA_PORTAL_ALIVE_SHARE" },
  { key: "celebrations", route: "/celebrations", marker: "LUMORA_PORTAL_ALIVE_CELEBRATIONS" },
]);

export function getPortals(): ReadonlyArray<PortalDef> {
  return PORTALS;
}

export function portalById(key: PortalKey): PortalDef | undefined {
  return PORTALS.find((p) => p.key === key);
}

/* LUMORA_COMPAT_REGISTRY_EXPORTS_v1:start */
/**
 * Compat exports for callers expecting historical names.
 * Keep lightweight + side-effect free.
 */
type AnyPortal = Record<string, any>;

function _asSlug(p: AnyPortal): string {
  return String(p.slug ?? p.id ?? p.key ?? p.name ?? "").trim();
}

function _isActive(p: AnyPortal): boolean {
  // Treat undefined as active; only explicit false disables.
  const a = p.active;
  const e = p.enabled;
  const d = p.disabled;
  if (d === true) return false;
  if (e === false) return false;
  if (a === false) return false;
  return true;
}

// Prefer local exports if file already defines PORTALS/REGISTRY; else import from resources.
let _PORTALS: AnyPortal[] | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../../resources/PORTALS");
  _PORTALS = Array.isArray(mod.PORTALS) ? mod.PORTALS : null;
} catch {
  _PORTALS = null;
}

function _getPortalsRaw(): AnyPortal[] {
  // If this module already exports PORTALS/REGISTRY, use it; otherwise fall back to resources.
  // @ts-ignore
  const localPortals = (typeof PORTALS !== "undefined" && Array.isArray(PORTALS)) ? PORTALS : null;
  // @ts-ignore
  const localRegistry = (typeof REGISTRY !== "undefined" && Array.isArray(REGISTRY)) ? REGISTRY : null;
  return (localPortals ?? localRegistry ?? _PORTALS ?? []);
}

/** Returns active portal objects */
export function getActivePortals(): AnyPortal[] {
  return _getPortalsRaw().filter(_isActive);
}

/** Returns all portals (raw objects) */
export function getPortalRegistry(): AnyPortal[] {
  return _getPortalsRaw();
}
/* LUMORA_COMPAT_REGISTRY_EXPORTS_v1:end */
