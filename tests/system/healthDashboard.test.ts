import { describe, expect, it } from "vitest";
import { buildSystemHealthDashboard } from "@/lib/system/healthDashboard";

describe("system-wide health dashboard", () => {
  it("reports healthy system", () => {
    const out = buildSystemHealthDashboard({
      services: [
        { name: "api", healthy: true, latencyMs: 120, critical: true },
        { name: "db", healthy: true, latencyMs: 30, critical: true },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.dashboard.overallStatus).toBe("healthy");
      expect(out.dashboard.healthyServices).toBe(2);
    }
  });

  it("reports degraded system", () => {
    const out = buildSystemHealthDashboard({
      services: [
        { name: "api", healthy: true, latencyMs: 120, critical: true },
        { name: "queue", healthy: false, latencyMs: 300, critical: false },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.dashboard.overallStatus).toBe("degraded");
      expect(out.dashboard.degradedServices).toBe(1);
    }
  });

  it("reports critical system", () => {
    const out = buildSystemHealthDashboard({
      services: [
        { name: "api", healthy: false, latencyMs: 500, critical: true },
        { name: "db", healthy: true, latencyMs: 30, critical: true },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.dashboard.overallStatus).toBe("critical");
      expect(out.dashboard.criticalFailures).toBe(1);
    }
  });

  it("rejects invalid latency", () => {
    const out = buildSystemHealthDashboard({
      services: [{ name: "api", healthy: true, latencyMs: -1, critical: true }],
    });

    expect(out).toEqual({ ok: false, reason: "invalid_latency" });
  });
});
