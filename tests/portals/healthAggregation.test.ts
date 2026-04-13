import { describe, expect, it } from "vitest";
import { aggregatePortalHealth } from "@/lib/portals/healthAggregation";

describe("portal health aggregation", () => {
  it("aggregates healthy and degraded portals", () => {
    const out = aggregatePortalHealth({
      portals: [
        { key: "FYP", enabled: true, routeOk: true, apiOk: true, pageOk: true, latencyMs: 120 },
        { key: "LIVE", enabled: true, routeOk: true, apiOk: false, pageOk: true, latencyMs: 250 },
        { key: "GMAR", enabled: false, routeOk: false, apiOk: false, pageOk: false, latencyMs: 0 },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.summary.total).toBe(3);
      expect(out.summary.enabled).toBe(2);
      expect(out.summary.healthy).toBe(2);
      expect(out.summary.degraded).toBe(1);
      expect(out.summary.avgLatencyMs).toBeCloseTo((120 + 250 + 0) / 3, 2);
    }
  });

  it("rejects missing portals", () => {
    const out = aggregatePortalHealth({ portals: [] });
    expect(out).toEqual({ ok: false, reason: "missing_portals" });
  });

  it("rejects duplicate portal keys", () => {
    const out = aggregatePortalHealth({
      portals: [
        { key: "FYP", enabled: true, routeOk: true, apiOk: true, pageOk: true, latencyMs: 100 },
        { key: "FYP", enabled: true, routeOk: true, apiOk: true, pageOk: true, latencyMs: 110 },
      ],
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_portal_key" });
  });

  it("rejects invalid latency", () => {
    const out = aggregatePortalHealth({
      portals: [
        { key: "FYP", enabled: true, routeOk: true, apiOk: true, pageOk: true, latencyMs: -1 },
      ],
    });

    expect(out).toEqual({ ok: false, reason: "invalid_latency" });
  });
});
