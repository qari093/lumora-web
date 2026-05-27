import { describe, expect, it } from "vitest";
import { createFyp94CrowdSignal, decrementFyp94ViewerCount, incrementFyp94ViewerCount } from "../../src/lib/fyp94/crowd/viewers";
import { calculateFyp94CategoryHeat } from "../../src/lib/fyp94/crowd/heat";
import { anonymizeFyp94CrowdSignal, validateFyp94CrowdPrivacy } from "../../src/lib/fyp94/crowd/privacy";
import { buildFyp94CategoryHeatLabel, buildFyp94ViewerLabel } from "../../src/lib/fyp94/crowd/display";

describe("FYP 9.4 Pack 010 — Invisible Crowd", () => {
  it("creates and updates anonymous viewer count", () => {
    const signal = createFyp94CrowdSignal({
      clipId: "clip_1",
      category: "surf",
      viewerCount: 10,
      activeWindowId: "window_1",
      now: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(incrementFyp94ViewerCount(signal).viewerCount).toBe(11);
    expect(decrementFyp94ViewerCount(signal).viewerCount).toBe(9);
  });

  it("calculates category heat", () => {
    const heat = calculateFyp94CategoryHeat([
      createFyp94CrowdSignal({ clipId: "1", category: "surf", viewerCount: 600, activeWindowId: "w" }),
      createFyp94CrowdSignal({ clipId: "2", category: "bike", viewerCount: 50, activeWindowId: "w" }),
    ]);

    expect(heat[0].category).toBe("surf");
    expect(heat[0].heatLevel).toBe("high");
  });

  it("aggregates anonymously without identity", () => {
    const signal = createFyp94CrowdSignal({
      clipId: "clip_1",
      category: "surf",
      viewerCount: 1,
      activeWindowId: "window_1",
    });

    const anon = anonymizeFyp94CrowdSignal(signal);

    expect(validateFyp94CrowdPrivacy(anon)).toBe(true);
    expect((anon as any).userId).toBeUndefined();
  });

  it("builds display labels", () => {
    const signal = createFyp94CrowdSignal({
      clipId: "clip_1",
      category: "surf",
      viewerCount: 2,
      activeWindowId: "window_1",
    });

    const heat = calculateFyp94CategoryHeat([signal])[0];

    expect(buildFyp94ViewerLabel(signal)).toContain("watching now");
    expect(buildFyp94CategoryHeatLabel(heat)).toContain("surf");
  });
});
