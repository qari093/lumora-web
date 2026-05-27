import {
  createGmarTelemetryEvent,
  createGmarObservabilityReport,
  assertGmarObservabilityReport
} from "@/src/core/gmar/final-completion/observability/analytics";

describe("GMAR Final Completion Phase 12 — Observability + Analytics", () => {
  it("creates telemetry events and healthy observability report", () => {
    const events = [
      createGmarTelemetryEvent({
        type: "session",
        playerId: "gmar_user_001",
        name: "session_start",
        now: new Date("2026-05-09T00:00:00.000Z")
      }),
      createGmarTelemetryEvent({
        type: "performance",
        playerId: "gmar_user_001",
        name: "dashboard_render_ms",
        value: 42,
        now: new Date("2026-05-09T00:01:00.000Z")
      }),
      createGmarTelemetryEvent({
        type: "realtime",
        playerId: "gmar_user_001",
        name: "presence_heartbeat",
        value: 1,
        now: new Date("2026-05-09T00:02:00.000Z")
      })
    ];

    const report = createGmarObservabilityReport(events);

    expect(report.ok).toBe(true);
    expect(report.eventCount).toBe(3);
    expect(report.errorCount).toBe(0);
    expect(report.performanceTracked).toBe(true);
    expect(report.realtimeTracked).toBe(true);
    expect(report.alertRulesReady).toBe(true);
    expect(report.crashReportsReady).toBe(true);
    expect(report.kpiReady).toBe(true);
    expect(assertGmarObservabilityReport(report)).toBe(true);
  });

  it("detects error telemetry", () => {
    const events = [
      createGmarTelemetryEvent({
        type: "error",
        playerId: "gmar_user_001",
        name: "runtime_error"
      })
    ];

    const report = createGmarObservabilityReport(events);

    expect(report.ok).toBe(false);
    expect(report.errorCount).toBe(1);
  });

  it("rejects missing telemetry identity", () => {
    expect(() =>
      createGmarTelemetryEvent({
        type: "session",
        playerId: " ",
        name: " "
      })
    ).toThrow("GMAR telemetry requires playerId and name.");
  });
});
