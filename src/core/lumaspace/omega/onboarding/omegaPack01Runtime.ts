import {
  LUMASPACE_OMEGA_CONSTITUTION,
  validateCivilizationConstitution,
} from "../foundation/civilizationCore";
import { createCitizenLifecycle, advanceCitizenLifecycle } from "../foundation/citizenLifecycle";
import { DEFAULT_LUMASPACE_CONSENT, enableConsent, canUseBridgeMatching } from "../foundation/privacyConsent";
import { createFirstLightExperience, completeFirstLight } from "./firstLight";
import { createFirstOrbitJourney, completeOrbitTask } from "./firstOrbit";
import { createFirstBridgeTutorial, sendTutorialStarlightPulse } from "./firstBridgeTutorial";

export function runLumaSpaceOmegaMegaPack01Runtime() {
  const citizenId = "omega-citizen-001";

  const constitutionValid = validateCivilizationConstitution(LUMASPACE_OMEGA_CONSTITUTION);

  const firstLight = completeFirstLight(
    createFirstLightExperience({
      citizenId,
      interests: ["creation", "memory", "community"],
      moodSeed: "builder",
      openingVerse: "Building with quiet fire",
    }),
  );

  let lifecycle = createCitizenLifecycle(citizenId);
  lifecycle = {
    ...lifecycle,
    completedFirstLight: firstLight.completed,
    completedFirstContribution: true,
    completedFirstBridgeTutorial: true,
    trustSignals: 1,
    contributionSignals: 1,
  };

  const advancedLifecycle = advanceCitizenLifecycle(lifecycle);

  let consent = DEFAULT_LUMASPACE_CONSENT;
  consent = enableConsent("bridge_matching", consent);

  let orbit = createFirstOrbitJourney(citizenId);
  orbit = completeOrbitTask(orbit, "view_space_core");
  orbit = completeOrbitTask(orbit, "open_living_card");
  orbit = completeOrbitTask(orbit, "send_first_light");
  orbit = completeOrbitTask(orbit, "create_first_memory");
  orbit = completeOrbitTask(orbit, "open_first_bridge_gate");

  const bridgeTutorial = sendTutorialStarlightPulse(createFirstBridgeTutorial(citizenId, 2));

  return {
    ok: constitutionValid &&
      firstLight.completed &&
      advancedLifecycle.stage === "active_citizen" &&
      canUseBridgeMatching(consent) &&
      orbit.progressPercent === 100 &&
      bridgeTutorial.completed,
    constitutionValid,
    firstLight,
    lifecycle: advancedLifecycle,
    consent,
    orbit,
    bridgeTutorial,
  };
}
