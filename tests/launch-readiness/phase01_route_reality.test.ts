import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  buildLaunchRouteRealityReport,
  findDuplicatePublicEndpoints,
  findOrphanCandidates,
  inferExposure,
  inferLaunchRouteKind,
  inferRouteDomain,
  isDeprecatedLaunchRoute,
  routePathFromAppFile,
  scanLaunchRoutes,
  summarizeRuntimeProbePlan
} from "@/src/core/launch-readiness";

describe("Launch Readiness Phase 01 — Route Reality Audit", () => {
  it("converts app files to route paths", () => {
    expect(routePathFromAppFile("app/api/fyp/feed/route.ts")).toBe("/api/fyp/feed");
    expect(routePathFromAppFile("app/(diag)/offline-diagnostics/page.tsx")).toBe("/offline-diagnostics");
    expect(routePathFromAppFile("app/page.tsx")).toBe("/");
  });

  it("infers route kind, exposure and domain", () => {
    expect(inferLaunchRouteKind("app/api/fyp/feed/route.ts")).toBe("api");
    expect(inferLaunchRouteKind("app/fyp/page.tsx")).toBe("page");
    expect(inferExposure("/api/dev/routes")).toBe("diagnostic");
    expect(inferExposure("/api/fyp/feed")).toBe("public");
    expect(inferRouteDomain("/api/creator-alchemy/dashboard")).toBe("creator_alchemy");
    expect(inferRouteDomain("/api/gmar/state/init")).toBe("gmar");
  });

  it("detects deprecated routes", () => {
    expect(isDeprecatedLaunchRoute("/api/coin/balance")).toBe(true);
    expect(isDeprecatedLaunchRoute("/api/wallet/balance")).toBe(false);
  });

  it("finds duplicate public endpoints and orphan candidates", () => {
    const routes = [
      { path: "/api/fyp/feed", file: "a", kind: "api", exposure: "public", domain: "fyp", canonical: true, deprecated: false, riskyPublicExposure: false },
      { path: "/api/fyp/feed", file: "b", kind: "api", exposure: "public", domain: "fyp", canonical: true, deprecated: false, riskyPublicExposure: false },
      { path: "/mystery", file: "c", kind: "page", exposure: "unknown", domain: "unknown", canonical: false, deprecated: false, riskyPublicExposure: false }
    ] as any;

    expect(findDuplicatePublicEndpoints(routes)).toEqual(["/api/fyp/feed"]);
    expect(findOrphanCandidates(routes)).toContain("/mystery");
  });

  it("scans launch routes from repository", () => {
    const routes = scanLaunchRoutes();

    expect(routes.length).toBeGreaterThan(0);
    expect(routes.some((route) => route.path === "/api/creator-alchemy/dashboard")).toBe(true);
    expect(routes.some((route) => route.path === "/gmar")).toBe(true);
  });

  it("builds route reality report", () => {
    const report = buildLaunchRouteRealityReport();

    expect(report.totalRoutes).toBeGreaterThan(0);
    expect(report.apiRoutes).toBeGreaterThan(0);
    expect(report.pageRoutes).toBeGreaterThan(0);
    expect(["PASS", "WARNING", "FAILED"]).toContain(report.status);

    writeFileSync("docs/launch-readiness/phase01_route_reality_report.json", JSON.stringify(report, null, 2) + "\n");
    expect(existsSync("docs/launch-readiness/phase01_route_reality_report.json")).toBe(true);
  });

  it("builds runtime probe plan", () => {
    const routes = scanLaunchRoutes();
    const plan = summarizeRuntimeProbePlan(routes);

    expect(plan.totalProbes).toBeGreaterThan(0);
    expect(plan.apiProbes + plan.pageProbes).toBe(plan.totalProbes);
  });

  it("creates route reality API endpoint", () => {
    expect(existsSync("app/api/launch-readiness/route-reality/route.ts")).toBe(true);
  });
});
