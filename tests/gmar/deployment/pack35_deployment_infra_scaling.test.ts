import { describe, expect, it } from "vitest";
import { deploymentScalingHealthy } from "../../../src/core/gmar/deployment/runtime";
import { resolveScaleMode } from "../../../src/core/gmar/deployment/scalePlan";
import { rollbackPlanHealthy } from "../../../src/core/gmar/deployment/rollback";

describe("GMAR Pack 35/40 — Deployment + Infra Scaling", () => {
  it("validates deployment scaling", () => {
    const runtime = deploymentScalingHealthy();

    expect(runtime.deployReady).toBe(true);
    expect(runtime.rollbackReady).toBe(true);
    expect(runtime.costCeilingReady).toBe(true);
  });

  it("resolves scale modes", () => {
    expect(resolveScaleMode(100)).toBe("seed");
    expect(resolveScaleMode(1000)).toBe("beta");
    expect(resolveScaleMode(10000)).toBe("surge_guarded");
  });

  it("validates rollback plan", () => {
    const plan = rollbackPlanHealthy();

    expect(plan.snapshotBeforeDeploy).toBe(true);
    expect(plan.oneCommandRollback).toBe(true);
  });
});
