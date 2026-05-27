import { describe, expect, it } from "vitest";
import { createRealityAnchor } from "../../src/live/reality/realityAnchorCore";
import { normalizeLuminosity } from "../../src/live/reality/groundFragmentCore";
import { getTimeAwarenessNotice } from "../../src/live/humanity/timeAwarenessCore";
import { evaluateCivilizationBreath } from "../../src/live/humanity/civilizationBreathCore";

describe("Lumora Live Pack 10 — Reality", () => {
  it("creates private-by-default Reality Anchor", () => {
    expect(createRealityAnchor("a1", "u1").privateByDefault).toBe(true);
  });

  it("normalizes Ground Fragment luminosity", () => {
    expect(normalizeLuminosity(140)).toBe(100);
    expect(normalizeLuminosity(-20)).toBe(0);
  });

  it("shows time-awareness notice after 90 minutes", () => {
    expect(getTimeAwarenessNotice(89).shouldShow).toBe(false);
    expect(getTimeAwarenessNotice(90).shouldShow).toBe(true);
  });

  it("opens Still Point only after unresolved imbalance", () => {
    expect(evaluateCivilizationBreath(3, false).shouldOpenStillPoint).toBe(true);
    expect(evaluateCivilizationBreath(3, true).shouldOpenStillPoint).toBe(false);
  });
});
