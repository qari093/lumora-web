/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { NextRequest } from "next/server";

export type InvokeResult = {
  status: number;
  body: any;
  headers?: Record<string, string>;
  bodyText?: string;
};

function repoRoot(): string {
  // vitest runs from repo root usually, but be defensive
  const cwd = process.cwd();
  // if tests are executed from within subdir, try to climb until package.json
  let d = cwd;
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(d, "package.json"))) return d;
    const up = path.dirname(d);
    if (up === d) break;
    d = up;
  }
  return cwd;
}

function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const u = url.startsWith("/") ? url : `/${url}`;
  return `http://127.0.0.1${u}`;
}

function normalizeRoute(url: string): string {
  // accept "/api/x", "api/x", or absolute URL
  try {
    const u = new URL(url);
    return u.pathname;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

function resolveRouteFile(routePath: string): string | null {
  const rp = normalizeRoute(routePath);

  // Only support Next App Router route modules for tests
  // "/api/foo/bar" -> "app/api/foo/bar/route.ts"
  const seg = rp.replace(/^\/+/, "").split("?")[0].split("#")[0];
  const candidateRel = path.join(...seg.split("/"), "route.ts");

  const root = repoRoot();
  const c1 = path.join(root, "app", candidateRel);
  const c2 = path.join(root, "src", "app", candidateRel);

  if (fs.existsSync(c1)) return c1;
  if (fs.existsSync(c2)) return c2;

  // Sometimes routes are ".tsx" (rare) or compiled to ".js" in ts-node env
  const c1tsx = c1.replace(/\.ts$/, ".tsx");
  const c2tsx = c2.replace(/\.ts$/, ".tsx");
  if (fs.existsSync(c1tsx)) return c1tsx;
  if (fs.existsSync(c2tsx)) return c2tsx;

  return null;
}

async function importRouteModule(routeUrlOrPath: string): Promise<any | null> {
  const fp = resolveRouteFile(routeUrlOrPath);
  if (!fp) return null;

  // Ensure ESM import works and avoid module cache between tests
  const u = pathToFileURL(fp).toString() + `?t=${Date.now()}`;
  return import(u);
}

function headersToObject(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => (out[k] = v));
  return out;
}

async function safeReadText(res: any): Promise<string> {
  try {
    if (res && typeof res.text === "function") return await res.text();
  } catch {}
  try {
    if (res && typeof res.arrayBuffer === "function") {
      const ab = await res.arrayBuffer();
      return new TextDecoder().decode(ab);
    }
  } catch {}
  return "";
}

async function safeReadJson(res: any): Promise<any | null> {
  try {
    if (res && typeof res.json === "function") return await res.json();
  } catch {}
  const t = await safeReadText(res);
  try {
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}

export async function invokeGET(
  url: string,
  init?: { headers?: Record<string, string> }
): Promise<InvokeResult> {
  const abs = toAbsoluteUrl(url);
  const req = new NextRequest(abs, { headers: init?.headers });

  const mod: any = await importRouteModule(url);
  if (!mod || typeof mod.GET !== "function") {
    return { status: 404, body: { ok: false, error: "route_not_found" } };
  }

  const res: any = await mod.GET(req);

  // NextResponse / Response compatible
  const status = typeof res?.status === "number" ? res.status : 200;
  const headers = res?.headers ? headersToObject(res.headers) : undefined;

  const json = await safeReadJson(res);
  if (json !== null) return { status, body: json, headers };

  const bodyText = await safeReadText(res);
  return { status, body: bodyText ? { ok: false, raw: bodyText } : { ok: false }, headers, bodyText };
}
