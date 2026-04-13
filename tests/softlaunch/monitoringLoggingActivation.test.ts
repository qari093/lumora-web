import { describe, expect, it } from "vitest";
import { evaluateMonitoringLoggingActivation } from "@/lib/softlaunch/monitoringLoggingActivation";

describe("soft-launch monitoring + logging activation", () => {
  it("passes when logs, metrics, and alerts are all enabled", () => {
    const out = evaluateMonitoringLoggingActivation({
      logsEnabled: true,
      metricsEnabled: true,
      alertsEnabled: true,
      traceSamplingPct: 10,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.activation.ready).toBe(true);
      expect(out.activation.traceSamplingPct).toBe(10);
    }
  });

  it("stays not-ready if alerts are disabled", () => {
    const out = evaluateMonitoringLoggingActivation({
      logsEnabled: true,
      metricsEnabled: true,
      alertsEnabled: false,
      traceSamplingPct: 10,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.activation.ready).toBe(false);
    }
  });

  it("rejects negative trace sampling", () => {
    const out = evaluateMonitoringLoggingActivation({
      logsEnabled: true,
      metricsEnabled: true,
      alertsEnabled: true,
      traceSamplingPct: -1,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_trace_sampling_pct" });
  });

  it("rejects trace sampling above 100", () => {
    const out = evaluateMonitoringLoggingActivation({
      logsEnabled: true,
      metricsEnabled: true,
      alertsEnabled: true,
      traceSamplingPct: 101,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_trace_sampling_pct" });
  });
});
