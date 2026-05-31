import type { GratitudeGem, WisdomBeacon } from "./types";

export function sendGratitudeGem(input: {
  fromCitizenId: string;
  beacon: WisdomBeacon;
  message: string;
}): GratitudeGem {
  if (!input.fromCitizenId.trim()) throw new Error("fromCitizenId_required");
  if (input.fromCitizenId === input.beacon.authorId) throw new Error("cannot_thank_self");
  if (input.message.trim().length < 3) throw new Error("message_too_short");

  return {
    id: `gratitude_${input.fromCitizenId}_${input.beacon.id}_${Date.now()}`,
    fromCitizenId: input.fromCitizenId,
    toAuthorId: input.beacon.authorId,
    beaconId: input.beacon.id,
    message: input.message,
    zencoinMicroReward: 1,
  };
}

export function applyGratitudeToBeacon(beacon: WisdomBeacon): WisdomBeacon {
  return {
    ...beacon,
    appreciationCount: beacon.appreciationCount + 1,
  };
}
