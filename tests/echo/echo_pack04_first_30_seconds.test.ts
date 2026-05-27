import { describe, expect, it } from "vitest";
import { holdToFeelRuntime } from "../../src/echo/onboarding/holdToFeel";
import { firstEmotionalTrack } from "../../src/echo/onboarding/firstTrack";
import { auraPulseChoreography } from "../../src/echo/onboarding/auraChoreography";
import { onboardingFallback } from "../../src/echo/onboarding/fallback";

describe("Echo Pack 04 — First 30 Seconds", () => {
  it("supports hold-to-feel onboarding", () => {
    expect(holdToFeelRuntime().cinematic).toBe(true);
  });

  it("supports emotional first track", () => {
    expect(firstEmotionalTrack().morphReady).toBe(true);
  });

  it("supports onboarding fallback", () => {
    expect(auraPulseChoreography().synchronized).toBe(true);
    expect(onboardingFallback().safeMode).toBe(true);
  });
});
