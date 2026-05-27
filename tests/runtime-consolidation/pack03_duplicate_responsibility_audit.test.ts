import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  auditDuplicateResponsibilities,
  createRuntimeRouteRecord,
  RESPONSIBILITY_CLUSTERS,
  summarizeDuplicateAudit
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 03 — Duplicate Responsibility Audit", () => {
  it("defines duplicate responsibility clusters", () => {
    expect(RESPONSIBILITY_CLUSTERS.length).toBeGreaterThanOrEqual(9);
    expect(RESPONSIBILITY_CLUSTERS.some((cluster) => cluster.responsibility === "feed_assembly")).toBe(true);
    expect(RESPONSIBILITY_CLUSTERS.some((cluster) => cluster.responsibility === "wallet_ledger")).toBe(true);
  });

  it("detects overlapping feed responsibility", () => {
    const report = auditDuplicateResponsibilities([
      createRuntimeRouteRecord({ path: "/api/fyp/feed", kind: "api" }),
      createRuntimeRouteRecord({ path: "/api/feed/final", kind: "api" }),
      createRuntimeRouteRecord({ path: "/api/content/multi-source/feed", kind: "api" })
    ]);

    expect(report.findingCount).toBe(3);
    expect(report.findings.some((finding) => finding.matchedCluster === "feed_assembly")).toBe(true);
  });

  it("detects high-risk wallet ledger duplication", () => {
    const report = auditDuplicateResponsibilities([
      createRuntimeRouteRecord({ path: "/api/wallet/ledger", kind: "api" }),
      createRuntimeRouteRecord({ path: "/api/coin/ledger", kind: "api" }),
      createRuntimeRouteRecord({ path: "/api/ledger/credit", kind: "api" })
    ]);

    expect(report.findings.some((finding) => finding.risk === "high")).toBe(true);
    expect(report.findings.some((finding) => finding.deprecatedAlias)).toBe(true);
  });

  it("builds repository duplicate audit summary", () => {
    const summary = summarizeDuplicateAudit();

    expect(summary.totalRoutes).toBeGreaterThan(0);
    expect(summary.auditedFindings).toBeGreaterThan(0);
  });

  it("writes duplicate responsibility audit report", () => {
    const report = auditDuplicateResponsibilities();
    writeFileSync("docs/runtime-consolidation/duplicate_responsibility_audit.json", JSON.stringify(report, null, 2) + "\n");

    expect(existsSync("docs/runtime-consolidation/duplicate_responsibility_audit.json")).toBe(true);
  });

  it("creates duplicate audit API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/duplicate-audit/route.ts")).toBe(true);
  });
});
