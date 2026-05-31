import { createWisdomBeacon, beaconIsDiscoverable } from "./beaconEngine";
import { searchWisdomBeacons } from "./discoveryEngine";
import { applyGratitudeToBeacon, sendGratitudeGem } from "./gratitudeEngine";
import { createWisdomChallenge, completeWisdomChallenge } from "./challengeEngine";
import { createWisdomReward } from "./rewardEngine";

export function runLumaSpaceOmegaMegaPack13Runtime() {
  let beacon = createWisdomBeacon({
    id: "beacon-013",
    authorId: "guardian-013",
    topic: "building",
    format: "video",
    title: "Start before it feels perfect",
    body: "Build one honest piece today, then let tomorrow improve it.",
    humanRecorded: true,
    trustScore: 92,
    appreciationCount: 4,
    visibility: "public",
  });

  const discovered = searchWisdomBeacons({
    beacons: [beacon],
    topic: "building",
    query: "honest",
  });

  const gem = sendGratitudeGem({
    fromCitizenId: "seeker-013",
    beacon,
    message: "Needed this.",
  });

  beacon = applyGratitudeToBeacon(beacon);

  const challenge = createWisdomChallenge({
    id: "challenge-013",
    topic: "building",
    prompt: "What did building patiently teach you?",
  });

  const challengeComplete = completeWisdomChallenge({
    challenge,
    appreciationCount: beacon.appreciationCount,
  });

  const reward = createWisdomReward({
    beacon,
    challenge,
  });

  return {
    ok:
      beaconIsDiscoverable(beacon) &&
      discovered.length === 1 &&
      gem.zencoinMicroReward === 1 &&
      challengeComplete &&
      reward.unlocked &&
      reward.rewardKind === "lamp_of_wisdom",
    beacon,
    discovered,
    gem,
    challenge,
    challengeComplete,
    reward,
  };
}
