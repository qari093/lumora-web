import {
  createGmarReadinessReport,
  assertGmarReadinessReport
} from "@/src/core/gmar/infra-active/readiness";

describe("GMAR Activation Phase 14 — Performance + Infrastructure", () => {
  it("creates ready infrastructure report", () => {
    const report = createGmarReadinessReport({
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(report.ok).toBe(true);
    expect(report.service).toBe("gmar");
    expect(report.status).toBe("ready");
    expect(report.checks.length).toBeGreaterThanOrEqual(10);
    expect(assertGmarReadinessReport(report)).toBe(true);
  });

  it("marks degraded when required check fails", () => {
    const report = createGmarReadinessReport({
      checks: [
        { name: "route", ok: true, required: true },
        { name: "gameplay_loop", ok: false, required: true }
      ]
    });

    expect(report.ok).toBe(false);
    expect(report.status).toBe("degraded");
  });
});
