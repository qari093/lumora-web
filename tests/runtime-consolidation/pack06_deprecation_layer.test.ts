import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  buildDeprecationHeaders,
  buildRuntimeDeprecationReport,
  evaluateRouteDeprecation,
  RUNTIME_DEPRECATIONS
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 06 — Deprecation Layer + Migration Notes", () => {
  it("defines deprecation registry", () => {
    expect(RUNTIME_DEPRECATIONS.length).toBeGreaterThanOrEqual(8);
    expect(RUNTIME_DEPRECATIONS.some((entry) => entry.deprecatedPrefix === "/api/coin")).toBe(true);
    expect(RUNTIME_DEPRECATIONS.some((entry) => entry.deprecatedPrefix === "/api/fyp94")).toBe(true);
  });

  it("evaluates non-deprecated routes", () => {
    const decision = evaluateRouteDeprecation("/api/fyp/feed");

    expect(decision.deprecated).toBe(false);
    expect(decision.allowed).toBe(true);
    expect(decision.canonicalRoute).toBeNull();
  });

  it("evaluates deprecated routes", () => {
    const decision = evaluateRouteDeprecation("/api/coin/balance");

    expect(decision.deprecated).toBe(true);
    expect(decision.allowed).toBe(true);
    expect(decision.severity).toBe("soft");
    expect(decision.canonicalRoute).toBe("/api/wallet");
  });

  it("builds deprecation headers", () => {
    const headers = buildDeprecationHeaders("/api/live/roomlist");

    expect(headers["x-lumora-deprecated"]).toBe("true");
    expect(headers["x-lumora-canonical-route"]).toBe("/api/live/rooms");
  });

  it("builds deprecation report", () => {
    const report = buildRuntimeDeprecationReport();

    expect(report.total).toBe(RUNTIME_DEPRECATIONS.length);
    expect(report.soft).toBeGreaterThan(0);
    expect(report.strict).toBeGreaterThan(0);
  });

  it("writes deprecation migration report", () => {
    const report = buildRuntimeDeprecationReport();
    writeFileSync("docs/runtime-consolidation/deprecation_migration_report.json", JSON.stringify(report, null, 2) + "\n");

    expect(existsSync("docs/runtime-consolidation/deprecation_migration_report.json")).toBe(true);
  });

  it("creates deprecations API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/deprecations/route.ts")).toBe(true);
  });
});
