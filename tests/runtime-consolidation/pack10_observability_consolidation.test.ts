import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  buildRuntimeObservabilityReport,
  metricStatus,
  worstStatus
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 10 — Observability Consolidation", () => {
  it("calculates metric status", () => {
    expect(metricStatus(10, 50, 100)).toBe("healthy");
    expect(metricStatus(60, 50, 100)).toBe("warning");
    expect(metricStatus(100, 50, 100)).toBe("critical");
  });

  it("calculates worst status", () => {
    expect(worstStatus([{ key: "a", value: 1, status: "healthy" }])).toBe("healthy");
    expect(worstStatus([{ key: "a", value: 1, status: "warning" }])).toBe("warning");
    expect(worstStatus([{ key: "a", value: 1, status: "critical" }])).toBe("critical");
  });

  it("builds runtime observability report", () => {
    const report = buildRuntimeObservabilityReport();

    expect(report.routeCount).toBeGreaterThan(0);
    expect(report.apiRouteCount).toBeGreaterThan(0);
    expect(report.orchestratorCount).toBeGreaterThanOrEqual(16);
    expect(report.eventBusReady).toBe(true);
    expect(report.persistenceBoundaryReady).toBe(true);
    expect(report.activationReady).toBe(true);
    expect(report.metrics.length).toBeGreaterThanOrEqual(7);
  });

  it("writes observability consolidation report", () => {
    const report = buildRuntimeObservabilityReport();
    writeFileSync("docs/runtime-consolidation/observability_consolidation_report.json", JSON.stringify(report, null, 2) + "\n");

    expect(existsSync("docs/runtime-consolidation/observability_consolidation_report.json")).toBe(true);
  });

  it("creates observability API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/observability/route.ts")).toBe(true);
  });
});
