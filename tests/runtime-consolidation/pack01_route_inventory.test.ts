import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import {
  buildRouteInventoryReport,
  createRuntimeRouteRecord,
  inferRuntimeDomain,
  inferRuntimeExposure,
  scanRuntimeRoutes
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 01 — Route Inventory + Domain Registry", () => {
  it("infers canonical runtime domains", () => {
    expect(inferRuntimeDomain("/api/creator-alchemy/dashboard")).toBe("creator_alchemy");
    expect(inferRuntimeDomain("/api/fyp/feed")).toBe("fyp");
    expect(inferRuntimeDomain("/api/feed/ranking")).toBe("feed");
    expect(inferRuntimeDomain("/api/live/rooms")).toBe("live");
    expect(inferRuntimeDomain("/api/wallet/balance")).toBe("wallet");
    expect(inferRuntimeDomain("/api/trust/audit")).toBe("trust_safety");
    expect(inferRuntimeDomain("/api/infra/cost")).toBe("infra_telemetry");
  });

  it("infers exposure safely", () => {
    expect(inferRuntimeExposure("/api/fyp/feed")).toBe("public");
    expect(inferRuntimeExposure("/api/dev/routes")).toBe("demo");
    expect(inferRuntimeExposure("/api/diag/trace")).toBe("internal");
    expect(inferRuntimeExposure("/api/feed/legacy")).toBe("deprecated");
  });

  it("creates route records", () => {
    const record = createRuntimeRouteRecord({
      path: "/api/creator-alchemy/dashboard",
      kind: "api",
      runtime: "dynamic"
    });

    expect(record.domain).toBe("creator_alchemy");
    expect(record.exposure).toBe("public");
    expect(record.kind).toBe("api");
  });

  it("scans app routes and builds report", () => {
    const routes = scanRuntimeRoutes();
    const report = buildRouteInventoryReport(routes);

    expect(report.summary.total).toBeGreaterThan(0);
    expect(report.summary.apiRoutes).toBeGreaterThan(0);
    expect(report.routes.some((route) => route.path.includes("/api/creator-alchemy"))).toBe(true);
  });

  it("creates route inventory API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/route-inventory/route.ts")).toBe(true);
  });
});
