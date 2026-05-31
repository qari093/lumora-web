import { describe, expect, it } from "vitest";
import {
  LUMASPACE_OMEGA_CONSTITUTION,
  validateCivilizationConstitution,
} from "@/src/core/lumaspace/omega/foundation/civilizationCore";
import { createCitizenLifecycle, advanceCitizenLifecycle } from "@/src/core/lumaspace/omega/foundation/citizenLifecycle";
import { DEFAULT_LUMASPACE_CONSENT, enableConsent, canUseBridgeMatching, canUseLocalOrbit } from "@/src/core/lumaspace/omega/foundation/privacyConsent";
import { createFirstLightExperience, completeFirstLight } from "@/src/core/lumaspace/omega/onboarding/firstLight";
import { createFirstOrbitJourney, completeOrbitTask } from "@/src/core/lumaspace/omega/onboarding/firstOrbit";
import { createFirstBridgeTutorial, sendTutorialStarlightPulse } from "@/src/core/lumaspace/omega/onboarding/firstBridgeTutorial";
import { runLumaSpaceOmegaMegaPack01Runtime } from "@/src/core/lumaspace/omega/onboarding/omegaPack01Runtime";

describe("LumaSpace Ω∞ Mega Pack 01 — Civilization Core + First Light", () => {
  it("validates civilization constitution", () => {
    expect(validateCivilizationConstitution(LUMASPACE_OMEGA_CONSTITUTION)).toBe(true);
    expect(LUMASPACE_OMEGA_CONSTITUTION.successMetrics.forbidden).toContain("infinite_scroll_dependency");
  });

  it("creates private-first consent defaults", () => {
    expect(DEFAULT_LUMASPACE_CONSENT.video_profile).toBe(false);
    expect(DEFAULT_LUMASPACE_CONSENT.local_orbit).toBe(false);
    const bridgeConsent = enableConsent("bridge_matching", DEFAULT_LUMASPACE_CONSENT);
    expect(canUseBridgeMatching(bridgeConsent)).toBe(true);
    expect(canUseLocalOrbit(bridgeConsent)).toBe(false);
  });

  it("creates and completes first light", () => {
    const firstLight = createFirstLightExperience({
      citizenId: "c1",
      interests: ["memory"],
      moodSeed: "calm",
      openingVerse: "Quietly becoming",
    });

    expect(firstLight.durationSeconds).toBe(7);
    expect(firstLight.closingLine).toBe("You are home.");
    expect(completeFirstLight(firstLight).completed).toBe(true);
  });

  it("advances first citizen lifecycle", () => {
    const state = createCitizenLifecycle("c2");
    const advanced = advanceCitizenLifecycle({
      ...state,
      completedFirstLight: true,
      completedFirstContribution: true,
      completedFirstBridgeTutorial: true,
    });

    expect(advanced.stage).toBe("active_citizen");
    expect(advanced.role).toBe("citizen");
  });

  it("completes first orbit journey", () => {
    let journey = createFirstOrbitJourney("c3");
    journey = completeOrbitTask(journey, "view_space_core");
    journey = completeOrbitTask(journey, "open_living_card");
    journey = completeOrbitTask(journey, "send_first_light");
    journey = completeOrbitTask(journey, "create_first_memory");
    journey = completeOrbitTask(journey, "open_first_bridge_gate");

    expect(journey.progressPercent).toBe(100);
  });

  it("runs first bridge tutorial", () => {
    const tutorial = createFirstBridgeTutorial("c4", 2);
    expect(tutorial.serendipityGateVisible).toBe(true);
    expect(sendTutorialStarlightPulse(tutorial).completed).toBe(true);
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack01Runtime();
    expect(runtime.ok).toBe(true);
    expect(runtime.orbit.progressPercent).toBe(100);
    expect(runtime.bridgeTutorial.completed).toBe(true);
  });
});
