import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  FYP_PRODUCTION_CAPABILITY,
  LIVE_PRODUCTION_CAPABILITY,
  buildFypLiveProductionReport,
  evaluateFypProduction,
  evaluateLiveProduction,
  statusFromFindings
} from "@/src/core/launch-readiness";

describe("Launch Readiness Phase 06 — FYP + Live Production Validation", () => {
  it("defines FYP production capability", () => {
    expect(FYP_PRODUCTION_CAPABILITY.feedAssembly).toBe(true);
    expect(FYP_PRODUCTION_CAPABILITY.rankingRuntime).toBe(true);
    expect(FYP_PRODUCTION_CAPABILITY.latencyCeilingMs).toBeLessThanOrEqual(300);
  });

  it("defines Live production capability", () => {
    expect(LIVE_PRODUCTION_CAPABILITY.roomLifecycle).toBe(true);
    expect(LIVE_PRODUCTION_CAPABILITY.eventIngestion).toBe(true);
    expect(LIVE_PRODUCTION_CAPABILITY.moderationFlow).toBe(true);
  });

  it("evaluates FYP production runtime", () => {
    const findings = evaluateFypProduction(FYP_PRODUCTION_CAPABILITY);

    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(statusFromFindings(findings)).toBe("WARNING");
    expect(findings.some((finding) => finding.capability === "latencyCeilingMs")).toBe(true);
  });

  it("evaluates Live production runtime", () => {
    const findings = evaluateLiveProduction(LIVE_PRODUCTION_CAPABILITY);

    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(statusFromFindings(findings)).toBe("WARNING");
    expect(findings.some((finding) => finding.capability === "recoveryReady")).toBe(true);
  });

  it("fails incomplete FYP runtime", () => {
    const findings = evaluateFypProduction({
      ...FYP_PRODUCTION_CAPABILITY,
      feedAssembly: false
    });

    expect(statusFromFindings(findings)).toBe("FAILED");
    expect(findings.some((finding) => finding.capability === "feedAssembly")).toBe(true);
  });

  it("builds FYP + Live production report", () => {
    const report = buildFypLiveProductionReport();

    expect(["PASS", "WARNING", "FAILED"]).toContain(report.status);
    expect(report.fypStatus).toBe("WARNING");
    expect(report.liveStatus).toBe("WARNING");
    expect(report.warningFindings).toBeGreaterThanOrEqual(2);
  });

  it("writes FYP + Live production report", () => {
    const report = buildFypLiveProductionReport();

    writeFileSync(
      "docs/launch-readiness/phase06_fyp_live_production_report.json",
      JSON.stringify(report, null, 2) + "\n"
    );

    expect(existsSync("docs/launch-readiness/phase06_fyp_live_production_report.json")).toBe(true);
  });

  it("creates FYP + Live production API endpoint", () => {
    expect(existsSync("app/api/launch-readiness/fyp-live-production/route.ts")).toBe(true);
  });
});
