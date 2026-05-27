import { describe, expect, it } from "vitest";
import { triggerDailyCircleReminder } from "@/src/lib/integration/retention-flow/circleReminder";
import { injectEmotionalSnapshot } from "@/src/lib/integration/retention-flow/emotionalSnapshot";
import { addSixSecondMomentEntry } from "@/src/lib/integration/retention-flow/momentEntry";
import { addFullMemoryTransition } from "@/src/lib/integration/retention-flow/fullMemoryTransition";
import { validateRetentionLoop } from "@/src/lib/integration/retention-flow/validateRetentionLoop";

describe("Integration Pack14 Retention Flow", () => {
  it("triggers reminder", () => {
    expect(triggerDailyCircleReminder({ creatorId: "c1", nextCircleIso: "t" }).enabled).toBe(true);
  });

  it("injects snapshot", () => {
    const s = injectEmotionalSnapshot({ afterWitnessViewed: true, traceCount: 2 });
    expect(s.visible).toBe(true);
    expect(s.interpretationText).toBe(false);
  });

  it("adds moment entry", () => {
    const m = addSixSecondMomentEntry({ videoId: "v1", timestampMs: 5000, durationMs: 20000 });
    expect(m.startMs).toBe(2000);
    expect(m.durationMs).toBe(6000);
  });

  it("adds memory transition", () => {
    const t = addFullMemoryTransition("m1");
    expect(t.visible).toBe(true);
    expect(t.href).toBe("/memory/m1");
  });

  it("validates loop", () => {
    const reminder = triggerDailyCircleReminder({ creatorId: "c1", nextCircleIso: "t" });
    const snapshot = injectEmotionalSnapshot({ afterWitnessViewed: true, traceCount: 2 });
    const moment = addSixSecondMomentEntry({ videoId: "v1", timestampMs: 5000, durationMs: 20000 });
    const transition = addFullMemoryTransition("m1");

    expect(validateRetentionLoop({ reminder, snapshot, moment, transition }).ok).toBe(true);
    expect(validateRetentionLoop({}).ok).toBe(false);
  });
});
