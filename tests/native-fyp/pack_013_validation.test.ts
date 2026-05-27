import { describe, expect, it } from "vitest";
import { getInitialVisualState, resolveVisualState } from "../../src/lib/native-fyp/runtime/ux";
import { shouldAnimateSwipe, getTranslateY } from "../../src/lib/native-fyp/runtime/transition";
import { shouldUnmute } from "../../src/lib/native-fyp/runtime/audio";

describe("native fyp pack 013", () => {
  it("initial visual state", () => {
    const s = getInitialVisualState();
    expect(s.showPoster).toBe(true);
  });

  it("resolves visual state fast", () => {
    const s = resolveVisualState(100);
    expect(s.showVideo).toBe(true);
  });

  it("resolves visual state slow", () => {
    const s = resolveVisualState(800);
    expect(s.showShimmer).toBe(true);
  });

  it("swipe animation", () => {
    expect(shouldAnimateSwipe(20)).toBe(true);
    expect(getTranslateY(50)).toContain("50px");
  });

  it("audio unlock", () => {
    expect(shouldUnmute(true)).toBe(true);
    expect(shouldUnmute(false)).toBe(false);
  });
});
