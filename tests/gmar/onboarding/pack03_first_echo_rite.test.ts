import { describe, expect, it } from "vitest";

import { arrivalDurationSeconds, normalizeArrivalMode } from "../../../src/core/gmar/onboarding/arrivalMode";
import { emotionalContractHealthy } from "../../../src/core/gmar/onboarding/emotionalContract";
import { completeResonanceCompass } from "../../../src/core/gmar/onboarding/resonanceCompass";
import { createFirstLightEcho } from "../../../src/core/gmar/memory/firstLight";
import { memoryThreadHasFirstLight } from "../../../src/core/gmar/memory/thread";
import { createDailyCivilizationSpark } from "../../../src/core/gmar/spark/civilizationSpark";
import { runFirstEchoRite } from "../../../src/core/gmar/onboarding/firstEchoRite";

describe("GMAR Pack 03 — First Echo Rite", () => {
  it("supports full rite and fast arrival", () => {
    expect(normalizeArrivalMode("fast_arrival")).toBe("fast_arrival");
    expect(normalizeArrivalMode("unknown")).toBe("full_rite");
    expect(arrivalDurationSeconds("fast_arrival")).toBe(90);
  });

  it("validates emotional contract", () => {
    expect(emotionalContractHealthy()).toBe(true);
  });

  it("creates privacy-safe resonance result", () => {
    const result = completeResonanceCompass("calm");

    expect(result.cluster).toBe("calm");
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.serverSafePayload).toEqual({ cluster: "calm", consent: true });
  });

  it("creates permanent First Light echo", () => {
    const echo = createFirstLightEcho();

    expect(echo.title).toBe("First Light");
    expect(echo.private).toBe(true);
    expect(echo.permanent).toBe(true);
  });

  it("starts memory thread with First Light", () => {
    expect(memoryThreadHasFirstLight()).toBe(true);
  });

  it("creates daily civilization spark", () => {
    const spark = createDailyCivilizationSpark("Waqar");

    expect(spark.text).toContain("Waqar");
    expect(spark.secondsToConsume).toBeLessThanOrEqual(5);
  });

  it("runs complete first echo rite", () => {
    const result = runFirstEchoRite({ mode: "fast_arrival", resonanceCluster: "calm" });

    expect(result.mode).toBe("fast_arrival");
    expect(result.contractSigned).toBe(true);
    expect(result.firstEchoTitle).toBe("First Light");
    expect(result.memoryThreadCount).toBe(1);
  });
});
