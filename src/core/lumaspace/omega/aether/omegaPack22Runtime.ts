import { createAetherSubscription, hasEntitlement } from "./subscriptionEngine";
import { createDeepMemoryLetter } from "./deepMemoryEngine";
import { createConstellationGift } from "./giftEngine";

export function runLumaSpaceOmegaMegaPack22Runtime() {
  const subscription = createAetherSubscription("citizen-022", true);
  const deepMemory = createDeepMemoryLetter({
    citizenId: "citizen-022",
    sourceMemoryIds: ["m1", "m2"],
    strongestMoment: "your first Constellation Bridge",
  });
  const gift = createConstellationGift({
    fromCitizenId: "citizen-022",
    communityId: "community-022",
    amount: 25,
    missionCompleted: true,
  });

  return {
    ok:
      hasEntitlement(subscription, "deep_memory") &&
      deepMemory.privateByDefault &&
      deepMemory.letter.includes("From your Space") &&
      gift.fundsCrystalMission &&
      gift.donorBloom === "legacy_bloom",
    subscription,
    deepMemory,
    gift,
  };
}
