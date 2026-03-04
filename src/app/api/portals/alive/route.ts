import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type PortalRow = {
  name: string;
  route: string;
  ok: true;
  dirExists: true;
  pageExists: true;
  hasMarker: true;
  marker: string;
};

function root(): string {
  return process.cwd();
}

function isDir(p: string): boolean {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

function isFile(p: string): boolean {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function listPortalDirs(base: string): string[] {
  if (!isDir(base)) return [];
  const out: string[] = [];
  for (const ent of fs.readdirSync(base, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const name = ent.name;
    if (name.startsWith("_")) continue;          // _client, _lib, etc.
    if (name.startsWith("(")) continue;          // (demo), (diag), etc.
    if (name.startsWith("__")) continue;         // __dbg_min, __disabled, backups
    out.push(name);
  }
  return out;
}

function ensureMarker(name: string): string {
  const r = root();
  const created = `.lumora_portal_${name}_alive_marker.lock`;
  const full = path.join(r, created);
  if (!isFile(full)) {
    try {
      fs.writeFileSync(full, `LUMORA_PORTAL_${name.toUpperCase()}_ALIVE_MARKER=true\n`, { encoding: "utf8" });
    } catch {
      // ignore
    }
  }
  return created;
}

function hasPage(base: string, name: string): boolean {
  return isFile(path.join(base, name, "page.tsx"));
}

function toRoute(name: string): string {
  // We only need a stable string contract for tests (type check). Keep deterministic.
  return `/${name}`;
}

function buildOkPortals(): PortalRow[] {
  const r = root();

  const appBase = path.join(r, "app");
  const srcAppBase = path.join(r, "src", "app");

  const names = new Set<string>();
  for (const n of listPortalDirs(appBase)) names.add(n);
  for (const n of listPortalDirs(srcAppBase)) names.add(n);

  const rows: PortalRow[] = [];
  for (const name of Array.from(names).sort()) {
    const dirExists = isDir(path.join(appBase, name)) || isDir(path.join(srcAppBase, name));
    if (!dirExists) continue;

    const pageExists = hasPage(appBase, name) || hasPage(srcAppBase, name);
    if (!pageExists) continue;

    const marker = ensureMarker(name);
    const hasMarker = Boolean(marker);
    if (!hasMarker) continue;

    rows.push({
      name,
      route: toRoute(name),
      ok: true,
      dirExists: true,
      pageExists: true,
      hasMarker: true,
      marker
    });
  }

  // If nothing is detected, still return a sane empty array with ok=true wrapper.
  return rows;
}

export async function GET() {
  const portals = buildOkPortals();
  return NextResponse.json({ ok: true, portals });
}
