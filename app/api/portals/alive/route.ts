import { NextResponse } from "next/server";
import { getPortals } from "@/lib/portals/status";

type AlivePortal = Readonly<{
  ok: boolean;
  route: string;
  marker: string;
  hasMarker: boolean;
  dirExists: boolean;
  pageExists: boolean;
}>;

function json(body: any, status = 200) {
  return NextResponse.json(body, { status });
}

function hasEnvMarker(name: string): boolean {
  const v = process.env[name];
  if (!v) return false;
  return v === "1" || v === "true" || v === "TRUE" || v === "yes" || v === "YES";
}

// Light FS check: route corresponds to app/<route>/page.* for static portals
function routeFsStatus(route: string): { dirExists: boolean; pageExists: boolean } {
  try {
    // runtime root: process.cwd() in Next (repo root)
    const fs = require("fs");
    const path = require("path");
    const clean = route === "/" ? "" : route.replace(/^\//, "");
    const dir = path.join(process.cwd(), "app", clean);
    const dirExists = fs.existsSync(dir) && fs.statSync(dir).isDirectory();

    const pageCandidates = [
      path.join(dir, "page.tsx"),
      path.join(dir, "page.ts"),
      path.join(dir, "page.jsx"),
      path.join(dir, "page.js"),
    ];
    const pageExists = pageCandidates.some((p) => fs.existsSync(p));
    return { dirExists, pageExists };
  } catch {
    return { dirExists: false, pageExists: false };
  }
}

export async function GET() {
  try {
    const defs = getPortals();
    const portals: AlivePortal[] = defs.map((p) => {
      const { dirExists, pageExists } = routeFsStatus(p.route);
      const hasMarker = hasEnvMarker(p.marker);
      const ok = Boolean(dirExists && pageExists && hasMarker);
      return { ok, route: p.route, marker: p.marker, hasMarker, dirExists, pageExists };
    });

    const ok = portals.every((p) => p.ok);
    return json(allPortalsAlive());
} catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
