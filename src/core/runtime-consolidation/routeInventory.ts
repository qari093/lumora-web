import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import {
  createRuntimeRouteRecord,
  type RuntimeDomain,
  type RuntimeRouteRecord
} from "./domainRegistry";

export interface RouteInventorySummary {
  total: number;
  apiRoutes: number;
  pageRoutes: number;
  unknownDomainRoutes: number;
  byDomain: Record<RuntimeDomain, number>;
}

export interface RouteInventoryReport {
  generatedAt: string;
  routes: RuntimeRouteRecord[];
  summary: RouteInventorySummary;
}

const EMPTY_DOMAIN_COUNTS: Record<RuntimeDomain, number> = {
  creator_alchemy: 0,
  fyp: 0,
  feed: 0,
  content: 0,
  signals: 0,
  intelligence: 0,
  personalization: 0,
  live: 0,
  wallet: 0,
  trust_safety: 0,
  infra_telemetry: 0,
  commerce: 0,
  gmar: 0,
  lumaspace: 0,
  media: 0,
  unknown: 0
};

export function scanRuntimeRoutes(root = process.cwd()): RuntimeRouteRecord[] {
  const records: RuntimeRouteRecord[] = [];

  const appDir = join(root, "app");
  try {
    walk(appDir, (file) => {
      const rel = relative(appDir, file).split(sep).join("/");
      if (rel.endsWith("/route.ts") || rel.endsWith("/route.tsx")) {
        records.push(
          createRuntimeRouteRecord({
            path: `/${rel.replace(/\/route\.tsx?$/, "")}`,
            kind: "api",
            runtime: "dynamic"
          })
        );
      }

      if (rel.endsWith("/page.ts") || rel.endsWith("/page.tsx")) {
        records.push(
          createRuntimeRouteRecord({
            path: `/${rel.replace(/\/page\.tsx?$/, "")}`.replace(/\/\(\w+\)/g, ""),
            kind: "page",
            runtime: "unknown"
          })
        );
      }
    });
  } catch {
    return [];
  }

  return records.sort((a, b) => a.path.localeCompare(b.path));
}

export function buildRouteInventoryReport(routes: RuntimeRouteRecord[]): RouteInventoryReport {
  const byDomain = { ...EMPTY_DOMAIN_COUNTS };

  for (const route of routes) {
    byDomain[route.domain] += 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    routes,
    summary: {
      total: routes.length,
      apiRoutes: routes.filter((route) => route.kind === "api").length,
      pageRoutes: routes.filter((route) => route.kind === "page").length,
      unknownDomainRoutes: byDomain.unknown,
      byDomain
    }
  };
}

export function writeRouteInventoryReport(path: string, routes = scanRuntimeRoutes()): RouteInventoryReport {
  const report = buildRouteInventoryReport(routes);
  writeFileSync(path, JSON.stringify(report, null, 2) + "\\n");
  return report;
}

function walk(dir: string, onFile: (file: string) => void): void {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;

    const full = join(dir, entry);
    const stat = statSync(full);

    if (stat.isDirectory()) walk(full, onFile);
    if (stat.isFile()) onFile(full);
  }
}
