import { NextRequest } from "next/server";

export type InvokeResult = {
  status: number;
  headers: Record<string, string>;
  bodyText: string;
  json: any | null;
};

function toHeadersObj(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => (out[k.toLowerCase()] = v));
  return out;
}

function normalizeRouteModule(mod: any): any {
  let cur = mod;
  for (let i = 0; i < 8; i++) {
    if (cur?.GET || cur?.POST || cur?.PUT || cur?.PATCH || cur?.DELETE) return cur;
    if (cur?.default) { cur = cur.default; continue; }
    if (cur?.route) { cur = cur.route; continue; }
    if (cur?.handler) { cur = cur.handler; continue; }
    break;
  }
  return cur;
}

function stripQueryHash(p: string): string {
  const q = p.indexOf("?");
  const h = p.indexOf("#");
  let cut = p.length;
  if (q >= 0) cut = Math.min(cut, q);
  if (h >= 0) cut = Math.min(cut, h);
  return p.slice(0, cut);
}

function toAbsoluteUrl(input: string): string {
  const raw = (input || "").trim();
  // already absolute
  if (/^https?:\/\//i.test(raw)) return raw;
  const p = raw.startsWith("/") ? raw : "/" + raw;
  // stable base for tests; host irrelevant for route handlers
  return "http://127.0.0.1:3000" + p;
}

function urlPathToRouteModulePath(urlPath: string): string {
  // Accept "/api/portals/alive" or "api/portals/alive"
  const clean = stripQueryHash(urlPath).trim();
  const p = clean.startsWith("/") ? clean : "/" + clean;
  if (!p.startsWith("/api/")) return clean;

  // tests/_helpers -> ../../app is project-root-relative (Vite resolves TS)
  // "/api/x/y" -> "../../app/api/x/y/route"
  return "../../app" + p + "/route";
}

async function loadRouteModule(modOrPath: any): Promise<any> {
  if (typeof modOrPath === "string") {
    const mapped = urlPathToRouteModulePath(modOrPath);
    const mod0 = await import(mapped);
    return normalizeRouteModule(mod0);
  }
  return normalizeRouteModule(modOrPath);
}

/**
 * In-process invoker for Next.js App Router route handlers.
 * Supports:
 *  - invokeGET("/api/portals/alive")
 *  - invokeGET(routeModuleObject, "/api/portals/alive")
 */
export async function invokeGET(
  modOrUrl: any,
  urlMaybe?: string,
  init?: { headers?: Record<string, string> }
): Promise<InvokeResult> {
  const isUrlOnly = typeof modOrUrl === "string" && (urlMaybe === undefined || urlMaybe === null);
  const url = isUrlOnly ? (modOrUrl as string) : (urlMaybe as string);

  const mod = isUrlOnly ? await loadRouteModule(modOrUrl) : await loadRouteModule(modOrUrl);

  if (!mod?.GET) {
    const k = mod && typeof mod === "object" ? Object.keys(mod) : [];
    const kd = mod?.default && typeof mod.default === "object" ? Object.keys(mod.default) : [];
    throw new Error("route_missing_GET keys: mod=" + JSON.stringify(k) + " mod.default=" + JSON.stringify(kd));
  }

  const req = new NextRequest(toAbsoluteUrl(url), { headers: init?.headers || {} });
  const res = await mod.GET(req);
  const bodyText = await res.text();
  let json: any = null;
  try { json = JSON.parse(bodyText); } catch { json = null; }
  return { status: res.status, headers: toHeadersObj(res.headers), bodyText, json };
}

export function isJsonLike(x: any): boolean {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}
