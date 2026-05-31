import type { ConstellationGift } from "./types";

export function createConstellationGift(input: {
  fromCitizenId: string;
  communityId: string;
  amount: number;
  missionCompleted?: boolean;
}): ConstellationGift {
  if (!input.fromCitizenId.trim()) throw new Error("fromCitizenId_required");
  if (!input.communityId.trim()) throw new Error("communityId_required");
  if (input.amount <= 0) throw new Error("amount_invalid");

  return {
    id: `constellation_gift_${input.fromCitizenId}_${input.communityId}_${Date.now()}`,
    fromCitizenId: input.fromCitizenId,
    communityId: input.communityId,
    amount: input.amount,
    fundsCrystalMission: true,
    donorBloom: input.missionCompleted ? "legacy_bloom" : "gift_bloom",
  };
}
