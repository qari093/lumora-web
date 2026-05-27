import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  buildRealityEnforcementDecisions,
  buildRealitySimulationReport,
  classifySimulationRisk,
  createSimulationFinding,
  recommendationForSimulationRisk,
  scanSimulationRiskFiles,
  severityForSimulationRisk
} from "@/src/core/launch-readiness";

describe("Launch Readiness Phase 02 — Reality vs Simulation Audit", () => {
  it("classifies simulation risks", () => {
    expect(classifySimulationRisk("const store = new Map();")).toBe("memory_only_state");
    expect(classifySimulationRisk("return { ok: true, fake: true }")).toBe("fake_success");
    expect(classifySimulationRisk("wallet mock memory ledger")).toBe("non_persistent_wallet");
    expect(classifySimulationRisk("checkout simulated order")).toBe("non_persistent_commerce");
    expect(classifySimulationRisk("not implemented")).toBe("stubbed_integration");
  });

  it("assigns risk severities", () => {
    expect(severityForSimulationRisk("fake_success")).toBe("critical");
    expect(severityForSimulationRisk("memory_only_state")).toBe("high");
    expect(severityForSimulationRisk("mock_runtime")).toBe("medium");
  });

  it("creates findings with recommendations", () => {
    const finding = createSimulationFinding("app/api/wallet/route.ts", "wallet mock memory ledger");

    expect(finding?.kind).toBe("non_persistent_wallet");
    expect(finding?.severity).toBe("critical");
    expect(recommendationForSimulationRisk("non_persistent_wallet")).toContain("ledger");
  });

  it("builds enforcement decisions", () => {
    const decisions = buildRealityEnforcementDecisions([
      {
        file: "app/api/wallet/route.ts",
        kind: "non_persistent_wallet",
        severity: "critical",
        evidence: "wallet mock memory ledger",
        recommendation: "fix"
      }
    ]);

    expect(decisions[0].runtime).toBe("wallet");
    expect(decisions[0].allowed).toBe(false);
  });

  it("scans repository files", () => {
    const files = scanSimulationRiskFiles();

    expect(files.length).toBeGreaterThan(0);
    expect(files.some((file) => file.startsWith("app/") || file.startsWith("src/"))).toBe(true);
  });

  it("builds reality simulation report from controlled input", () => {
    const report = buildRealitySimulationReport({
      scannedFiles: 2,
      findings: [
        {
          file: "app/api/wallet/route.ts",
          kind: "non_persistent_wallet",
          severity: "critical",
          evidence: "wallet mock memory ledger",
          recommendation: "fix"
        },
        {
          file: "app/api/fyp/route.ts",
          kind: "mock_runtime",
          severity: "medium",
          evidence: "mock",
          recommendation: "fix"
        }
      ]
    });

    expect(report.status).toBe("FAILED");
    expect(report.criticalFindings).toBe(1);
    expect(report.mediumFindings).toBe(1);
  });

  it("writes reality simulation report", () => {
    const report = buildRealitySimulationReport({ scannedFiles: 0, findings: [] });
    writeFileSync("docs/launch-readiness/phase02_reality_simulation_report.json", JSON.stringify(report, null, 2) + "\n");

    expect(existsSync("docs/launch-readiness/phase02_reality_simulation_report.json")).toBe(true);
  });

  it("creates reality simulation API endpoint", () => {
    expect(existsSync("app/api/launch-readiness/reality-simulation/route.ts")).toBe(true);
  });
});
