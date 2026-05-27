import { describe, expect, it } from "vitest";
import { triggerAfterWitnessState } from "@/src/lib/integration/after-witness-injection/triggerAfterWitness";
import { injectMoodRingIntoDashboard } from "@/src/lib/integration/after-witness-injection/injectMoodRing";
import { injectTraceSummaryIntoDashboard } from "@/src/lib/integration/after-witness-injection/injectTraceSummary";
import { attachReplaySnippet } from "@/src/lib/integration/after-witness-injection/attachReplaySnippet";
import { validatePostCircleUx } from "@/src/lib/integration/after-witness-injection/validatePostCircleUx";

describe("Integration Pack08 — After Witness Injection", () => {
  it("triggers After Witness state post-circle", () => {
    const state = triggerAfterWitnessState({
      creatorId: "c1",
      circleId: "circle1",
      circleCompleted: true,
    });

    expect(state.triggered).toBe(true);
    expect(state.state).toBe("after-witness");
  });

  it("injects mood ring into dashboard", () => {
    const dashboard = injectMoodRingIntoDashboard({}, { dominant: "warm", intensity: 0.75 });

    expect(dashboard.moodRing.visible).toBe(true);
    expect(dashboard.moodRing.dominant).toBe("warm");
  });

  it("injects trace summary", () => {
    const dashboard = injectTraceSummaryIntoDashboard({}, { text: "2 present, 1 held" });

    expect(dashboard.traceSummary.visible).toBe(true);
    expect(dashboard.traceSummary.interpretationText).toBe(false);
  });

  it("attaches replay snippet", () => {
    const dashboard = attachReplaySnippet({
      dashboard: {},
      videoId: "v1",
      startMs: 2000,
      endMs: 8000,
    });

    expect(dashboard.replaySnippet.visible).toBe(true);
    expect(dashboard.replaySnippet.durationMs).toBe(6000);
  });

  it("validates post-circle UX", () => {
    const afterWitness = triggerAfterWitnessState({
      creatorId: "c1",
      circleId: "circle1",
      circleCompleted: true,
    });

    let dashboard: any = {};
    dashboard = injectMoodRingIntoDashboard(dashboard, { dominant: "warm", intensity: 0.75 });
    dashboard = injectTraceSummaryIntoDashboard(dashboard, { text: "2 present, 1 held" });
    dashboard = attachReplaySnippet({ dashboard, videoId: "v1", startMs: 2000, endMs: 8000 });

    expect(validatePostCircleUx({ afterWitness, dashboard }).ok).toBe(true);
    expect(validatePostCircleUx({ afterWitness, dashboard: {} }).ok).toBe(false);
  });
});
