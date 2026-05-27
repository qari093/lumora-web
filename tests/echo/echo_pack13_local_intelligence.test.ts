import { describe, expect, it } from "vitest";
import { localInferenceEngine } from "../../src/echo/intelligence/localInference";
import { preferenceDriftLearning } from "../../src/echo/intelligence/preferenceDrift";
import { contextDetection } from "../../src/echo/intelligence/contextDetection";
import { emotionalPrediction } from "../../src/echo/intelligence/emotionalPrediction";

describe("Echo Pack 13 — Local Intelligence", () => {
  it("supports local inference", () => {
    expect(localInferenceEngine().onDevice).toBe(true);
  });

  it("supports preference learning", () => {
    expect(preferenceDriftLearning().adaptive).toBe(true);
  });

  it("supports contextual prediction", () => {
    expect(contextDetection().motionAware).toBe(true);
    expect(emotionalPrediction().predictive).toBe(true);
  });
});
