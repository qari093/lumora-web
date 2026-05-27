import type { LaunchRouteRecord } from "./types";

export interface LaunchRouteRuntimeProbe {
  path: string;
  expectedKind: "api" | "page";
  expectedResponseContract: "json" | "html";
  canProbeWithoutAuth: boolean;
  placeholderRisk: boolean;
}

export function buildRuntimeProbes(routes: LaunchRouteRecord[]): LaunchRouteRuntimeProbe[] {
  return routes
    .filter((route) => route.exposure === "public" || route.exposure === "diagnostic")
    .slice(0, 200)
    .map((route) => ({
      path: route.path,
      expectedKind: route.kind,
      expectedResponseContract: route.kind === "api" ? "json" : "html",
      canProbeWithoutAuth: route.exposure === "public" || route.path.includes("/health"),
      placeholderRisk:
        route.path.includes("/mock") ||
        route.path.includes("/demo") ||
        route.path.includes("/placeholder") ||
        route.path.includes("/debug")
    }));
}

export function summarizeRuntimeProbePlan(routes: LaunchRouteRecord[]) {
  const probes = buildRuntimeProbes(routes);

  return {
    generatedAt: new Date().toISOString(),
    totalProbes: probes.length,
    apiProbes: probes.filter((probe) => probe.expectedKind === "api").length,
    pageProbes: probes.filter((probe) => probe.expectedKind === "page").length,
    placeholderRiskProbes: probes.filter((probe) => probe.placeholderRisk).length,
    probes
  };
}
