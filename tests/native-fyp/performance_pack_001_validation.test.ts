import { describe, expect, it } from "vitest";
import {
  isFrameWithinBudget,
  isSwipeWithinBudget,
  NATIVE_FYP_MAX_DOM_VIDEO_CARDS,
  NATIVE_FYP_SWIPE_BUDGET_MS,
} from "../../src/lib/native-fyp/performance/budget";
import { validateVideoCardCount } from "../../src/lib/native-fyp/performance/domGuard";

describe("native fyp performance pack 001", () => {
  it("locks 200ms swipe target", () => {
    expect(NATIVE_FYP_SWIPE_BUDGET_MS).toBe(200);
    expect(isSwipeWithinBudget(180)).toBe(true);
    expect(isSwipeWithinBudget(250)).toBe(false);
  });

  it("locks 3-card DOM limit", () => {
    expect(NATIVE_FYP_MAX_DOM_VIDEO_CARDS).toBe(3);
    expect(validateVideoCardCount(3).ok).toBe(true);
    expect(validateVideoCardCount(4).ok).toBe(false);
  });

  it("validates frame budget", () => {
    expect(isFrameWithinBudget(10)).toBe(true);
    expect(isFrameWithinBudget(20)).toBe(false);
  });
});
