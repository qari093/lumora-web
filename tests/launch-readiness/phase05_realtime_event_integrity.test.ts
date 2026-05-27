import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  REALTIME_EVENT_CONTRACTS,
  REALTIME_EVENT_CAPABILITIES,
  getRealtimeCapability,
  evaluateRealtimeEventContract,
  buildRealtimeSynchronizationChecks,
  buildRealtimeEventIntegrityReport
} from "@/src/core/launch-readiness";

describe("Launch Readiness Phase 05 — Realtime & Event Integrity", () => {
  it("defines realtime event contracts", () => {
    expect(REALTIME_EVENT_CONTRACTS.length).toBeGreaterThanOrEqual(7);
    expect(REALTIME_EVENT_CONTRACTS.some((event) => event.domain === "live")).toBe(true);
    expect(REALTIME_EVENT_CONTRACTS.some((event) => event.domain === "wallet")).toBe(true);
  });

  it("defines realtime event capabilities", () => {
    expect(REALTIME_EVENT_CAPABILITIES.length).toBeGreaterThanOrEqual(7);
    expect(getRealtimeCapability("wallet", "wallet.ledger.entry")?.hasReplaySafeId).toBe(true);
  });

  it("passes healthy realtime contracts", () => {
    const contract = REALTIME_EVENT_CONTRACTS.find((event) => event.eventName === "live.room.event")!;
    const finding = evaluateRealtimeEventContract(contract);

    expect(finding.status).toBe("PASS");
    expect(finding.missing).toHaveLength(0);
  });

  it("fails unsafe GMAR replay contract", () => {
    const contract = REALTIME_EVENT_CONTRACTS.find((event) => event.eventName === "gmar.match.event")!;
    const finding = evaluateRealtimeEventContract(contract);

    expect(finding.status).toBe("FAILED");
    expect(finding.missing).toContain("replaySafeId");
  });

  it("builds realtime synchronization checks", () => {
    const checks = buildRealtimeSynchronizationChecks();

    expect(checks.length).toBeGreaterThanOrEqual(5);
    expect(checks.some((check) => check.domain === "gmar" && check.status === "WARNING")).toBe(true);
  });

  it("builds realtime event integrity report", () => {
    const report = buildRealtimeEventIntegrityReport();

    expect(report.totalContracts).toBeGreaterThanOrEqual(7);
    expect(report.failedContracts).toBeGreaterThanOrEqual(1);
    expect(["PASS", "WARNING", "FAILED"]).toContain(report.status);
  });

  it("writes realtime event integrity report", () => {
    const report = buildRealtimeEventIntegrityReport();

    writeFileSync(
      "docs/launch-readiness/phase05_realtime_event_integrity_report.json",
      JSON.stringify(report, null, 2) + "\n"
    );

    expect(existsSync("docs/launch-readiness/phase05_realtime_event_integrity_report.json")).toBe(true);
  });

  it("creates realtime event API endpoint", () => {
    expect(existsSync("app/api/launch-readiness/realtime-events/route.ts")).toBe(true);
  });
});
