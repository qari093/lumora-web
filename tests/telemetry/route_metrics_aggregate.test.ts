import { describe, it, expect, beforeEach } from "vitest"
import { recordRouteDuration, getRouteMetrics, resetRouteMetricsForTest } from "@/lib/telemetry/metrics"

describe("route metrics aggregation", () => {
  beforeEach(() => resetRouteMetricsForTest())

  it("aggregates count/min/max/avg and quantiles", () => {
    for (const d of [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) {
      recordRouteDuration("/api/x", d)
    }
    const m = getRouteMetrics().find((x) => x.route === "/api/x")
    expect(m).toBeTruthy()
    expect(m!.count).toBe(10)
    expect(m!.min).toBe(10)
    expect(m!.max).toBe(100)
    expect(Math.round(m!.avg)).toBe(55)
    expect(m!.p50).toBeGreaterThan(0)
    expect(m!.p95).toBeGreaterThanOrEqual(m!.p50)
    expect(m!.p99).toBeGreaterThanOrEqual(m!.p95)
  })

  it("keeps separate buckets per route", () => {
    recordRouteDuration("/a", 5)
    recordRouteDuration("/b", 99)
    const all = getRouteMetrics()
    expect(all.map((x) => x.route)).toEqual(["/a", "/b"])
  })
})
