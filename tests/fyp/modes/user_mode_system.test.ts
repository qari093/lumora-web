import { describe, expect, it } from "vitest";

import {
  createUserAtmosphereProfile,
  assertValidAtmosphereProfile
} from "@/src/core/fyp/profile/atmosphereProfile";

import {
  calculateModeAffinity,
  getTopMode
} from "@/src/core/fyp/modes/modeAffinity";

import {
  suggestMode
} from "@/src/core/fyp/modes/predictiveSuggestions";

import {
  switchMode,
  resetAtmosphereProfile
} from "@/src/core/fyp/modes/modeControls";

import {
  applyMicroFeedback
} from "@/src/core/fyp/feedback/microFeedback";

describe("Lumora FYP User Mode System", () => {
  it("creates a valid atmosphere profile", () => {
    const profile = createUserAtmosphereProfile("waqar");

    expect(profile.currentMode).toBe("drift");
    expect(assertValidAtmosphereProfile(profile)).toBe(true);
  });

  it("calculates mode affinity", () => {
    const profile = createUserAtmosphereProfile("waqar");
    const scores = calculateModeAffinity(profile);

    expect(scores.length).toBeGreaterThan(0);
    expect(getTopMode(profile)).toBe("drift");
  });

  it("suggests context-aware mode", () => {
    const profile = createUserAtmosphereProfile("waqar");

    expect(
      suggestMode(profile, {
        hour: 23
      }).mode
    ).toBe("deep");

    expect(
      suggestMode(profile, {
        hour: 18,
        weather: "rain"
      }).mode
    ).toBe("drift");

    expect(
      suggestMode(profile, {
        hour: 18,
        squadMode: "chaos"
      }).mode
    ).toBe("chaos");
  });

  it("switches and resets mode", () => {
    const profile = createUserAtmosphereProfile("waqar");
    const switched = switchMode(profile, "energy");

    expect(switched.currentMode).toBe("energy");
    expect(switched.preferredModes[0]).toBe("energy");

    const reset = resetAtmosphereProfile(switched);

    expect(reset.currentMode).toBe("drift");
  });

  it("applies micro feedback safely", () => {
    const profile = createUserAtmosphereProfile("waqar");

    const pushed = applyMicroFeedback(profile, "push_harder");
    expect(pushed.energyTolerance).toBeGreaterThan(profile.energyTolerance);

    const lowered = applyMicroFeedback(pushed, "too_chaotic");
    expect(lowered.chaosTolerance).toBeLessThan(pushed.chaosTolerance);
  });
});
