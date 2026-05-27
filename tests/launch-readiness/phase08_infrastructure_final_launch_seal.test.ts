import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  FINAL_INFRASTRUCTURE_CAPABILITIES,
  FINAL_LAUNCH_REQUIRED_LOCKS,
  buildFinalLaunchSealReport,
  evaluateInfrastructureCapability,
  evaluateRequiredLocks
} from "@/src/core/launch-readiness";

describe("Launch Readiness Phase 08 — Infrastructure + Final Launch Seal", () => {
  it("defines required phase locks", () => {
    expect(FINAL_LAUNCH_REQUIRED_LOCKS.length).toBe(7);
    expect(FINAL_LAUNCH_REQUIRED_LOCKS).toContain(".lumora_launch_readiness_phase07_lock");
  });

  it("defines infrastructure capabilities", () => {
    expect(FINAL_INFRASTRUCTURE_CAPABILITIES.length).toBeGreaterThanOrEqual(10);
    expect(FINAL_INFRASTRUCTURE_CAPABILITIES.some((item) => item.name === "rollback_safety")).toBe(true);
  });

  it("evaluates required locks", () => {
    const result = evaluateRequiredLocks(FINAL_LAUNCH_REQUIRED_LOCKS);

    expect(Array.isArray(result.missingLocks)).toBe(true);
    expect(Array.isArray(result.findings)).toBe(true);
  });

  it("passes ready infrastructure capability", () => {
    const capability = FINAL_INFRASTRUCTURE_CAPABILITIES.find((item) => item.name === "rollback_safety")!;
    const finding = evaluateInfrastructureCapability(capability);

    expect(finding.status).toBe("PASS");
  });

  it("warns private-beta-only infrastructure capability", () => {
    const capability = FINAL_INFRASTRUCTURE_CAPABILITIES.find((item) => item.name === "chaos_recovery")!;
    const finding = evaluateInfrastructureCapability(capability);

    expect(finding.status).toBe("WARNING");
    expect(finding.requiredFix).toContain("private-beta");
  });

  it("builds final launch seal report", () => {
    const report = buildFinalLaunchSealReport();

    expect(["PASS", "WARNING", "FAILED"]).toContain(report.status);
    expect(report.totalInfrastructureChecks).toBeGreaterThanOrEqual(10);
    expect(report.certification.mode).toMatch(/private_beta|blocked/);
  });

  it("writes final launch seal report", () => {
    const report = buildFinalLaunchSealReport();

    writeFileSync(
      "docs/launch-readiness/phase08_infrastructure_final_launch_seal_report.json",
      JSON.stringify(report, null, 2) + "\n"
    );

    expect(existsSync("docs/launch-readiness/phase08_infrastructure_final_launch_seal_report.json")).toBe(true);
  });

  it("creates final seal API endpoint", () => {
    expect(existsSync("app/api/launch-readiness/final-seal/route.ts")).toBe(true);
  });
});
