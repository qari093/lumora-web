import { describe, expect, it } from "vitest";
import {
  tuningSystems,
  testingRuntimeReady,
  tuningFeedback,
  retentionSignals,
} from "../../src/echo/testing/userTuning";

describe("Echo Pack 25 — User Testing + Tuning", () => {
  it("supports tuning systems", () => {
    expect(tuningSystems).toContain("feedback-loop");
  });

  it("supports runtime testing", () => {
    expect(testingRuntimeReady()).toBe(true);
  });

  it("supports retention tuning", () => {
    expect(tuningFeedback().adaptive).toBe(true);
    expect(retentionSignals().healthy).toBe(true);
  });
});
