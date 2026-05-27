import type { LaunchRouteRealityReport, LaunchRouteRecord } from "./types";
import { scanLaunchRoutes } from "./scanner";

export function findDuplicatePublicEndpoints(routes: LaunchRouteRecord[]): string[] {
  const counts = new Map<string, number>();

  for (const route of routes) {
    if (route.exposure === "public") {
      counts.set(route.path, (counts.get(route.path) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([path]) => path);
}

export function findOrphanCandidates(routes: LaunchRouteRecord[]): string[] {
  return routes
    .filter((route) => route.domain === "unknown" || route.exposure === "unknown")
    .map((route) => route.path);
}

export function buildLaunchRouteRealityReport(routes = scanLaunchRoutes()): LaunchRouteRealityReport {
  const duplicatePublicEndpoints = findDuplicatePublicEndpoints(routes);
  const orphanCandidates = findOrphanCandidates(routes);
  const riskyPublicRoutes = routes.filter((route) => route.riskyPublicExposure).length;
  const deprecatedRoutes = routes.filter((route) => route.deprecated).length;
  const unknownExposureRoutes = routes.filter((route) => route.exposure === "unknown").length;

  const status =
    riskyPublicRoutes > 0 || duplicatePublicEndpoints.length > 0
      ? "FAILED"
      : unknownExposureRoutes > 0 || deprecatedRoutes > 0 || orphanCandidates.length > 0
        ? "WARNING"
        : "PASS";

  return {
    generatedAt: new Date().toISOString(),
    status,
    totalRoutes: routes.length,
    apiRoutes: routes.filter((route) => route.kind === "api").length,
    pageRoutes: routes.filter((route) => route.kind === "page").length,
    unknownExposureRoutes,
    deprecatedRoutes,
    riskyPublicRoutes,
    canonicalRoutes: routes.filter((route) => route.canonical).length,
    orphanCandidates,
    duplicatePublicEndpoints,
    routes
  };
}
