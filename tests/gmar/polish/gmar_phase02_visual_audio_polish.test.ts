import { describe, it, expect } from "vitest";

import { shaderQuality } from "../../../src/core/gmar/visuals/shaders";
import { bloomEffect } from "../../../src/core/gmar/visuals/postProcessing";
import { particleDensity } from "../../../src/core/gmar/visuals/particles";
import { spatialMix } from "../../../src/core/gmar/audiofx/spatial";
import { uiPolish } from "../../../src/core/gmar/ui/uiPolish";

describe("GMAR PHASE 2", () => {
  it("enables shaders", () => {
    expect(shaderQuality(5).enabled).toBe(true);
  });

  it("enables bloom", () => {
    expect(bloomEffect(true).bloom).toBe(true);
  });

  it("creates particles", () => {
    expect(particleDensity(500).density).toBe(500);
  });

  it("supports spatial audio", () => {
    expect(spatialMix(4).immersive).toBe(true);
  });

  it("enables ui polish", () => {
    expect(uiPolish(true).polished).toBe(true);
  });
});
