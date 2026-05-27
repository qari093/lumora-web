import { describe, expect, it } from "vitest";
import { calculateGestureVelocity, isSwipeAwayGesture } from "@/src/monetization/exit-interaction/gesture";
import { withinExitGraceWindow } from "@/src/monetization/exit-interaction/graceWindow";
import { buildExitInteractionUi } from "@/src/monetization/exit-interaction/ui";
import { triggerExitReward } from "@/src/monetization/exit-interaction/reward";
import { canShowExitInteraction, createExitInteractionPreferences } from "@/src/monetization/exit-interaction/preferences";

describe("Monetization Pack07 — Exit Interaction", () => {
  it("detects swipe-away gesture velocity", () => {
    const sample = { startX: 0, endX: 100, startTimeMs: 0, endTimeMs: 100 };

    expect(calculateGestureVelocity(sample)).toBe(1);
    expect(isSwipeAwayGesture(sample)).toBe(true);
  });

  it("validates 100-150ms grace window", () => {
    expect(withinExitGraceWindow({ touchStartAtMs: 0, nowMs: 120 })).toBe(true);
    expect(withinExitGraceWindow({ touchStartAtMs: 0, nowMs: 50 })).toBe(false);
    expect(withinExitGraceWindow({ touchStartAtMs: 0, nowMs: 200 })).toBe(false);
  });

  it("builds non-blocking exit interaction UI", () => {
    const ui = buildExitInteractionUi({ eligible: true, rewardZen: 3 });

    expect(ui.visible).toBe(true);
    expect(ui.rewardText).toBe("+3 Zen");
    expect(ui.dismissible).toBe(true);
    expect(ui.blocksSwipe).toBe(false);
  });

  it("grants reward only when engaged", () => {
    expect(triggerExitReward({ engaged: true, rewardZen: 3 }).amount).toBe(3);
    expect(triggerExitReward({ engaged: false, rewardZen: 3 }).amount).toBe(0);
  });

  it("respects opt-out preference", () => {
    expect(canShowExitInteraction({
      preferences: createExitInteractionPreferences(true),
      eligible: true,
    })).toBe(true);

    expect(canShowExitInteraction({
      preferences: createExitInteractionPreferences(false),
      eligible: true,
    })).toBe(false);
  });
});
