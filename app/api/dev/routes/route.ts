import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

type RouteInfo = {
  route: string;
  file: string;
};

function isDir(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function walkAppPages(appRoot: string): RouteInfo[] {
  const out: RouteInfo[] = [];

  const stack: string[] = [appRoot];
  while (stack.length) {
    const dir = stack.pop() as string;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        // Skip node_modules / build artifacts if any accidentally exist here
        if (e.name === "node_modules" || e.name === ".next") continue;
        stack.push(full);
        continue;
      }

      if (!e.isFile()) continue;
      if (e.name !== "page.tsx" && e.name !== "page.jsx" && e.name !== "page.ts" && e.name !== "page.js") continue;

      const rel = path.relative(appRoot, full).split(path.sep).join("/"); // posix-ish
      // Convert "segment/segment/page.tsx" -> "/segment/segment"
      const route = "/" + rel.replace(/\/page\.(t|j)sx?$/i, "");
      out.push({ route: route === "/page" ? "/" : route, file: full });
    }
  }

  // Sort: shortest first, then alpha
  out.sort((a, b) => a.route.length - b.route.length || a.route.localeCompare(b.route));
  return out;
}

export async function GET() {
  // Hard dev-only gate
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const cwd = process.cwd();
  const roots: { name: string; dir: string }[] = [];

  const appRoot = path.join(cwd, "app");
  const srcAppRoot = path.join(cwd, "src", "app");

  if (isDir(appRoot)) roots.push({ name: "app", dir: appRoot });
  if (isDir(srcAppRoot)) roots.push({ name: "src/app", dir: srcAppRoot });

  const payload = roots.map((r) => ({
    root: r.name,
    pages: walkAppPages(r.dir),
  }));

  return NextResponse.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    cwd,
    roots: payload,
  });
}
