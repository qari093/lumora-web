import { describe, expect, it } from "vitest";
import { NATIVE_FYP_PROHIBITED_SOURCES } from "../../../src/lib/native-fyp/policy";
import { NATIVE_FYP_MAX_DOM_VIDEO_CARDS, NATIVE_FYP_SWIPE_BUDGET_MS } from "../../../src/lib/native-fyp/performance/budget";
import { classifySwipeSpeed } from "../../../src/lib/native-fyp/preload/intent";
import { buildFinalSeal, verifyIntegrity } from "../../../src/lib/native-fyp/runtime/finalSeal";

describe("native fyp final validation pack 001", () => {
  it("keeps YouTube blocked from core native FYP", () => {
    expect(NATIVE_FYP_PROHIBITED_SOURCES).toContain("youtube_iframe");
    expect(NATIVE_FYP_PROHIBITED_SOURCES).toContain("youtube_download");
  });

  it("keeps runtime budget locked", () => {
    expect(NATIVE_FYP_MAX_DOM_VIDEO_CARDS).toBe(3);
    expect(NATIVE_FYP_SWIPE_BUDGET_MS).toBe(200);
  });

  it("detects rapid swipe mode", () => {
    expect(classifySwipeSpeed(4, 1000)).toBe("rapid");
  });

  it("verifies final native FYP seal", () => {
    expect(verifyIntegrity(buildFinalSeal())).toBe(true);
  });
});
