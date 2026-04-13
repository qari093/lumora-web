import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateBuildRegressionSweep } from "@/lib/softlaunch/buildRegressionSweep";

describe("soft-launch build regression sweep", () => {
  it("passes valid regression sweep", () => {
    const signals = JSON.parse(fs.readFileSync("data/softlaunch/build-regression-sweep.json", "utf8"));
    const out = evaluateBuildRegressionSweep({ signals });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.sweep.total).toBe(5);
      expect(out.sweep.passed).toBe(5);
      expect(out.sweep.ready).toBe(true);
    }
  });

  it("rejects duplicate name", () => {
    const out = evaluateBuildRegressionSweep({
      signals: [
        { name: "typecheck", passed: true },
        { name: "typecheck", passed: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_name" });
  });

  it("rejects missing name", () => {
    const out = evaluateBuildRegressionSweep({
      signals: [
        { name: "", passed: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "missing_name" });
  });

  it("fails readiness when one signal fails", () => {
    const out = evaluateBuildRegressionSweep({
      signals: [
        { name: "typecheck", passed: true },
        { name: "tests", passed: false }
      ]
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.sweep.ready).toBe(false);
    }
  });
});
