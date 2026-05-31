export type AetherTier = "free" | "aether_pass";
export type AetherEntitlement = "deep_memory" | "constellation_gift" | "cosmetic_aether" | "soundscape_layer";

export type AetherSubscription = {
  citizenId: string;
  tier: AetherTier;
  active: boolean;
  entitlements: AetherEntitlement[];
};

export type DeepMemoryLetter = {
  id: string;
  citizenId: string;
  sourceMemoryIds: string[];
  letter: string;
  privateByDefault: true;
};

export type ConstellationGift = {
  id: string;
  fromCitizenId: string;
  communityId: string;
  amount: number;
  fundsCrystalMission: boolean;
  donorBloom: "gift_bloom" | "legacy_bloom";
};
