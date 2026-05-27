import { describe, expect, it } from "vitest";
import {
  buildIntensityCurve,
  classifyIntensity,
  computeIntensity,
  insertIntensitySpikes,
  preventFlatIntensitySequences,
  resetAfterSpike,
} from "../../src/lib/fyp_archive/intensity_curve";

describe("Phase 5 Pack 17 — Intensity Curve", () => {
  const feed = [
    { id: "1", humanScore: 0.1 },
    { id: "2", humanScore: 0.5, eventDensity: 0.4 },
    { id: "3", viralScore: 1, humanScore: 1 },
    { id: "4", humanScore: 0.2 },
    { id: "5", humanScore: 0.3 },
  ];

  it("computes intensity", () => {
    expect(computeIntensity(feed[2])).toBeGreaterThan(computeIntensity(feed[0]));
  });

  it("classifies intensity", () => {
    expect(classifyIntensity(feed[2])).toBe("spike");
  });

  it("inserts intensity spikes", () => {
    const out = insertIntensitySpikes(feed, 2);
    expect(out.some((x: any) => x.spikeSlot)).toBe(true);
  });

  it("prevents flat intensity sequences", () => {
    const out = preventFlatIntensitySequences([
      { id: "1", intensity: "low" },
      { id: "2", intensity: "low" },
      { id: "3", intensity: "low" },
      { id: "4", intensity: "low" },
    ], 3);

    expect(out).toHaveLength(3);
  });

  it("resets after spike", () => {
    const out = resetAfterSpike([
      { id: "1", intensity: "spike" },
      { id: "2", intensity: "medium" },
    ]);

    expect(out[1].postSpikeReset).toBe(true);
  });

  it("builds full intensity curve", () => {
    const out = buildIntensityCurve(feed);
    expect(out.length).toBeGreaterThan(0);
  });
});
