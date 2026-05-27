import { describe, expect, it } from "vitest";
import { sleepRuntime, sleepRuntimeHealthy } from "../../src/core/nexa/recovery/sleep/sleepRuntime";
import { readinessRuntime, recoveryBands, readinessRuntimeHealthy } from "../../src/core/nexa/recovery/readiness/readinessRuntime";
import { breathworkRuntime, breathworkRuntimeHealthy } from "../../src/core/nexa/recovery/breathwork/breathworkRuntime";

describe("NEXA Pack 07/12 — Recovery + Sleep", () => {
  it("supports sleep runtime", () => {
    expect(sleepRuntime.sleepScoring).toBe(true);
    expect(sleepRuntime.sleepConstellation).toBe(true);
    expect(sleepRuntime.echoWindDown).toBe(true);
    expect(sleepRuntimeHealthy()).toBe(true);
  });

  it("supports readiness and recovery bands", () => {
    expect(readinessRuntime.hrvReadiness).toBe(true);
    expect(readinessRuntime.adaptiveDeload).toBe(true);
    expect(recoveryBands).toContain("restore");
    expect(recoveryBands).toContain("momentum");
    expect(readinessRuntimeHealthy()).toBe(true);
  });

  it("supports breathwork systems", () => {
    expect(breathworkRuntime.boxBreathing).toBe(true);
    expect(breathworkRuntime.cyclicSigh).toBe(true);
    expect(breathworkRuntime.echoAudioSync).toBe(true);
    expect(breathworkRuntimeHealthy()).toBe(true);
  });
});
