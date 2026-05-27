import { describe, expect, it } from "vitest";
import { endSwipeMeasure, getSwipeDurationMs, startSwipeMeasure } from "../../src/lib/native-fyp/performance/swipeMeasure";
import { hasGpuTransformStyle, validateNoLayoutShift } from "../../src/lib/native-fyp/performance/layoutGuard";

describe("native fyp performance pack 002", () => {
  it("measures swipe duration", () => {
    const started = startSwipeMeasure(100);
    const ended = endSwipeMeasure(started, 250);
    expect(getSwipeDurationMs(ended)).toBe(150);
  });

  it("detects gpu-safe transforms", () => {
    expect(hasGpuTransformStyle("transform: translate3d(0, 100%, 0)")).toBe(true);
    expect(hasGpuTransformStyle("top: 100px")).toBe(false);
  });

  it("validates no layout shift", () => {
    expect(validateNoLayoutShift({ beforeTop: 10, afterTop: 10.5 })).toBe(true);
    expect(validateNoLayoutShift({ beforeTop: 10, afterTop: 20 })).toBe(false);
  });
});
