import { describe, expect, it } from "vitest";
import {
  computeHumanScore,
  boostHumanTags,
  downrankEnvironmental,
  detectEventDensity,
  attachHumanSignals,
} from "../../src/lib/fyp_archive/human_scoring";

describe("Phase 2 Pack 6 — Human Scoring", () => {
  it("computes human score", () => {
    expect(computeHumanScore({ title: "crowd people reaction" })).toBeGreaterThan(0.5);
  });

  it("boosts human tags", () => {
    const out = boostHumanTags({ title: "kids playing" });
    expect(out.humanScore).toBeGreaterThan(0);
  });

  it("downranks environmental content", () => {
    const out = downrankEnvironmental({ title: "mountain landscape" });
    expect(out.humanScore).toBe(0);
  });

  it("detects event density", () => {
    const d = detectEventDensity({ title: "crowd event", duration: 20 });
    expect(d).toBeGreaterThan(0);
  });

  it("attaches full human signals", () => {
    const out = attachHumanSignals({ title: "family crowd event", duration: 25 });
    expect(out.humanScore).toBeTruthy();
    expect(out.eventDensity).toBeTruthy();
  });
});
