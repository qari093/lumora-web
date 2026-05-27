import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  buildPersistenceStateIntegrityReport,
  buildRecoveryCheck,
  evaluatePersistenceTarget,
  getPersistenceCapabilities,
  LAUNCH_PERSISTENCE_TARGETS
} from "@/src/core/launch-readiness";

describe("Launch Readiness Phase 03 — Persistence & State Integrity", () => {
  it("defines launch persistence targets", () => {
    expect(LAUNCH_PERSISTENCE_TARGETS.length).toBeGreaterThanOrEqual(10);
    expect(LAUNCH_PERSISTENCE_TARGETS.some((target) => target.name === "wallet_ledger")).toBe(true);
    expect(LAUNCH_PERSISTENCE_TARGETS.some((target) => target.name === "commerce_orders")).toBe(true);
  });

  it("resolves persistence capabilities", () => {
    expect(getPersistenceCapabilities("wallet_ledger")?.persistentWrite).toBe(true);
    expect(getPersistenceCapabilities("commerce_orders")?.persistentWrite).toBe(false);
  });

  it("passes healthy persistence targets", () => {
    const target = LAUNCH_PERSISTENCE_TARGETS.find((item) => item.name === "wallet_ledger")!;
    const finding = evaluatePersistenceTarget(target);

    expect(finding.status).toBe("PASS");
    expect(finding.risk).toBe("none");
  });

  it("fails incomplete commerce persistence", () => {
    const target = LAUNCH_PERSISTENCE_TARGETS.find((item) => item.name === "commerce_orders")!;
    const finding = evaluatePersistenceTarget(target);

    expect(finding.status).toBe("FAILED");
    expect(finding.risk).toBe("critical");
    expect(finding.requiredFix).toContain("Complete");
  });

  it("builds recovery checks", () => {
    const walletTarget = LAUNCH_PERSISTENCE_TARGETS.find((item) => item.name === "wallet_ledger")!;
    const mediaTarget = LAUNCH_PERSISTENCE_TARGETS.find((item) => item.name === "media_uploads")!;

    expect(buildRecoveryCheck(walletTarget).status).toBe("PASS");
    expect(buildRecoveryCheck(mediaTarget).status).toBe("WARNING");
  });

  it("builds persistence state integrity report", () => {
    const report = buildPersistenceStateIntegrityReport();

    expect(report.totalTargets).toBeGreaterThanOrEqual(10);
    expect(report.failedTargets).toBeGreaterThanOrEqual(1);
    expect(["PASS", "WARNING", "FAILED"]).toContain(report.status);
    expect(report.findings.some((finding) => finding.target === "commerce_orders")).toBe(true);
  });

  it("writes persistence state integrity report", () => {
    const report = buildPersistenceStateIntegrityReport();
    writeFileSync("docs/launch-readiness/phase03_persistence_state_integrity_report.json", JSON.stringify(report, null, 2) + "\n");

    expect(existsSync("docs/launch-readiness/phase03_persistence_state_integrity_report.json")).toBe(true);
  });

  it("creates persistence state API endpoint", () => {
    expect(existsSync("app/api/launch-readiness/persistence-state/route.ts")).toBe(true);
  });
});
