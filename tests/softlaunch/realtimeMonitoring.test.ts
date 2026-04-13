import { describe, expect, it } from "vitest";
import { resolveRealtimeMonitoring } from "@/lib/softlaunch/realtimeMonitoring";

describe("soft-launch realtime monitoring activation", () => {
  it("activates full monitoring", () => {
    const out = resolveRealtimeMonitoring({
      healthEnabled: true,
      sessionTrackingEnabled: true,
      fypMetricsEnabled: true,
      errorTrackingEnabled: true,
      refreshIntervalSec: 30,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.monitoring.active).toBe(true);
      expect(out.monitoring.refreshIntervalSec).toBe(30);
    }
  });

  it("allows partial monitoring but marks inactive", () => {
    const out = resolveRealtimeMonitoring({
      healthEnabled: true,
      sessionTrackingEnabled: false,
      fypMetricsEnabled: true,
      errorTrackingEnabled: true,
      refreshIntervalSec: 30,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.monitoring.active).toBe(false);
    }
  });

  it("rejects too-low refresh interval", () => {
    const out = resolveRealtimeMonitoring({
      healthEnabled: true,
      sessionTrackingEnabled: true,
      fypMetricsEnabled: true,
      errorTrackingEnabled: true,
      refreshIntervalSec: 1,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_refresh_interval" });
  });

  it("rejects too-high refresh interval", () => {
    const out = resolveRealtimeMonitoring({
      healthEnabled: true,
      sessionTrackingEnabled: true,
      fypMetricsEnabled: true,
      errorTrackingEnabled: true,
      refreshIntervalSec: 500,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_refresh_interval" });
  });
});
