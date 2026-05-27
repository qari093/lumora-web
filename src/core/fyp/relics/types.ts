import type { AtmosphereMode } from "../core/types";

export type RelicRarity =
  | "common"
  | "rare"
  | "phantom"
  | "mythic";

export type PhantomRelic = {
  relicId: string;
  mode: AtmosphereMode;
  rarity: RelicRarity;
  title: string;
  claimLimit: number;
  claimedCount: number;
  startsAt: number;
  expiresAt: number;
  oneTimeOnly: true;
};

export type RelicClaim = {
  claimId: string;
  relicId: string;
  userId: string;
  claimedAt: number;
  valid: boolean;
};
