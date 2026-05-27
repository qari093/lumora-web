import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { LaunchRouteRecord } from "./types";
import {
  inferExposure,
  inferLaunchRouteKind,
  inferRouteDomain,
  isCanonicalLaunchRoute,
  isDeprecatedLaunchRoute,
  isRiskyPublicExposure,
  routePathFromAppFile
} from "./classifier";

function walk(dir: string): string[] {
  try {
    return readdirSync(dir).flatMap((entry) => {
      const full = join(dir, entry);
      const stat = statSync(full);
      return stat.isDirectory() ? walk(full) : [full];
    });
  } catch {
    return [];
  }
}

export function scanLaunchRoutes(appDir = "app"): LaunchRouteRecord[] {
  return walk(appDir)
    .filter((file) => /\/(route|page)\.(ts|tsx|js|jsx)$/.test(file))
    .map((file) => {
      const normalizedFile = file.replace(/\\/g, "/");
      const path = routePathFromAppFile(normalizedFile);
      const exposure = inferExposure(path);

      return {
        path,
        file: normalizedFile,
        kind: inferLaunchRouteKind(normalizedFile),
        exposure,
        domain: inferRouteDomain(path),
        canonical: isCanonicalLaunchRoute(path),
        deprecated: isDeprecatedLaunchRoute(path),
        riskyPublicExposure: isRiskyPublicExposure(path, exposure)
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}
