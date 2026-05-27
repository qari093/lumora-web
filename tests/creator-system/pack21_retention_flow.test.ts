import { describe, expect, it } from "vitest";
import { buildDailyAnchorCircleReminder } from "@/src/lib/creator-system/retention-flow/dailyAnchorReminder";
import { shouldTriggerEmotionalSnapshot } from "@/src/lib/creator-system/retention-flow/emotionalSnapshotTrigger";
import { buildSixSecondMomentEntry } from "@/src/lib/creator-system/retention-flow/sixSecondMomentEntry";
import { buildFullMemoryTransition } from "@/src/lib/creator-system/retention-flow/fullMemoryTransition";
import { suggestContrastingNextVideo } from "@/src/lib/creator-system/retention-flow/contrastingNextVideo";

describe("Pack21 Retention Flow", () => {
  it("builds daily anchor circle reminder", () => {
    const reminder = buildDailyAnchorCircleReminder({
      creatorId: "c1",
      nextCircleIso: "2026-05-02T19:00:00.000Z",
    });

    expect(reminder.softReminder).toBe(true);
    expect(reminder.message).toContain("quietly");
  });

  it("triggers emotional snapshot only after viewed human trace", () => {
    expect(shouldTriggerEmotionalSnapshot({ afterWitnessViewed: true, humanTraceCount: 1 })).toBe(true);
    expect(shouldTriggerEmotionalSnapshot({ afterWitnessViewed: false, humanTraceCount: 1 })).toBe(false);
  });

  it("builds 6-second moment entry", () => {
    const entry = buildSixSecondMomentEntry({
      videoId: "v1",
      timestampMs: 5000,
      videoDurationMs: 20000,
    });

    expect(entry.startMs).toBe(2000);
    expect(entry.durationMs).toBe(6000);
  });

  it("builds full memory transition", () => {
    expect(buildFullMemoryTransition("m1").targetUrl).toBe("/memory/m1");
    expect(buildFullMemoryTransition(undefined).visible).toBe(false);
  });

  it("suggests one contrasting next video", () => {
    const next = suggestContrastingNextVideo("still", [
      { videoId: "v1", tone: "warm" as const },
      { videoId: "v2", tone: "curious" as const },
    ]);

    expect(next?.videoId).toBe("v2");
  });
});
