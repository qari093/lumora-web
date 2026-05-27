import {
  createGmarQaReport,
  assertGmarQaReport
} from "@/src/core/gmar/qa-active/qaGate";

describe("GMAR Activation Phase 15 — Testing + QA", () => {
  it("creates passing QA gate", () => {
    const report = createGmarQaReport();

    expect(report.ok).toBe(true);
    expect(report.phase).toBe("testing_qa");
    expect(report.blockerCount).toBe(0);
    expect(report.checks.length).toBeGreaterThanOrEqual(8);
    expect(assertGmarQaReport(report)).toBe(true);
  });

  it("detects required blocker", () => {
    const report = createGmarQaReport({
      checks: [
        { name: "typescript", passed: true, required: true },
        { name: "route_smoke", passed: false, required: true }
      ]
    });

    expect(report.ok).toBe(false);
    expect(report.blockerCount).toBe(1);
  });
});
