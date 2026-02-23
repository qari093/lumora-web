import fs from "node:fs";
import path from "node:path";
import { PORTALS, type PortalDef } from "@/lib/portals/registry";

export type PortalAliveItem = Readonly<{
  key: PortalDef["key"];
  route: PortalDef["route"];
  marker: string;
  dirExists: boolean;
  pageExists: boolean;
  hasMarker: boolean;
  ok: boolean;
}>;

export function repoRoot(): string {
  // Always compute from current module location, not HOME.
  // lib/portals/status.ts -> repo root is process.cwd() in Next build/runtime.
  return process.cwd();
}

export function markerPath(marker: string): string {
  return path.join(repoRoot(), `.lumora_portal_${marker.toLowerCase()}_lock`);
}

export function portalAliveSnapshot(): ReadonlyArray<PortalAliveItem> {
  const root = repoRoot();
  return PORTALS.map((p) => {
    const dir = p.route === "/" ? "app" : path.join("app", p.route.replace(/^\//, ""));
    const dirAbs = path.join(root, dir);
    const pageAbs = path.join(dirAbs, "page.tsx");

    const dirExists = fs.existsSync(dirAbs);
    const pageExists = fs.existsSync(pageAbs);

    // Marker strategy: allow either old marker files or new lock files.
    const markerA = path.join(root, `.lumora_portal_alive_${p.key}.lock`);
    const markerB = path.join(root, `${p.marker}.lock`);
    const markerC = markerPath(p.marker);

    const hasMarker = fs.existsSync(markerA) || fs.existsSync(markerB) || fs.existsSync(markerC);

    const ok = Boolean(dirExists && pageExists && hasMarker);
    return Object.freeze({
      key: p.key,
      route: p.route,
      marker: p.marker,
      dirExists,
      pageExists,
      hasMarker,
      ok,
    });
  });
}

export function allPortalsAlive(): { ok: boolean; portals: ReadonlyArray<PortalAliveItem>; ts: number } {
  const portals = portalAliveSnapshot();
  const ok = portals.every((p) => p.ok);
  return { ok, portals, ts: Date.now() };
}

/* LUMORA_COMPAT_STATUS_EXPORTS_v1:start */
/**
 * Compat exports for callers expecting historical names.
 * Status is derived from portal registry; keep deterministic.
 */
type AnyPortal = Record<string, any>;

function _asSlug(p: AnyPortal): string {
  return String(p.slug ?? p.id ?? p.key ?? p.name ?? "").trim();
}

function _isActive(p: AnyPortal): boolean {
  const a = p.active;
  const e = p.enabled;
  const d = p.disabled;
  if (d === true) return false;
  if (e === false) return false;
  if (a === false) return false;
  return true;
}

function _statusFrom(p: AnyPortal): { ok: boolean; status: "alive" | "down" | "disabled" } {
  if (!_asSlug(p)) return { ok: false, status: "down" };
  if (!_isActive(p)) return { ok: true, status: "disabled" };
  // If route/health flags exist, honor them; else assume alive for static registry.
  const ok = (p.ok === true) ? true : (p.ok === false ? false : true);
  return { ok, status: ok ? "alive" : "down" };
}

function _getRegistry(): AnyPortal[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const reg = require("./registry");
    if (typeof reg.getPortalRegistry === "function") return reg.getPortalRegistry();
  } catch {}
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../../resources/PORTALS");
    if (Array.isArray(mod.PORTALS)) return mod.PORTALS;
  } catch {}
  return [];
}

export function statusLabel(s: string): string {
  if (s === "alive") return "Alive";
  if (s === "disabled") return "Disabled";
  return "Down";
}

export function getPortals(): AnyPortal[] {
  return _getRegistry();
}

export const PORTAL_STATUS: Record<string, { ok: boolean; status: "alive" | "down" | "disabled"; label: string }> =
  Object.fromEntries(
    _getRegistry()
      .map((p) => {
        const slug = _asSlug(p);
        const st = _statusFrom(p);
        return [slug, { ...st, label: statusLabel(st.status) }];
      })
      .filter(([k]) => Boolean(k))
  );
/* LUMORA_COMPAT_STATUS_EXPORTS_v1:end */
