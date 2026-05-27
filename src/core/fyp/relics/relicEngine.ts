import type {
  PhantomRelic,
  RelicRarity
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createPhantomRelic(input: {
  relicId: string;
  mode: AtmosphereMode;
  rarity: RelicRarity;
  title: string;
  claimLimit: number;
  startsAt: number;
  expiresAt: number;
}): PhantomRelic {
  if (!input.relicId.trim() || !input.title.trim()) {
    throw new Error("Phantom relic requires relicId and title.");
  }

  if (input.claimLimit < 1) {
    throw new Error("Phantom relic claimLimit must be positive.");
  }

  if (input.expiresAt <= input.startsAt) {
    throw new Error("Phantom relic expiresAt must be after startsAt.");
  }

  return {
    relicId: input.relicId,
    mode: input.mode,
    rarity: input.rarity,
    title: input.title,
    claimLimit: input.claimLimit,
    claimedCount: 0,
    startsAt: input.startsAt,
    expiresAt: input.expiresAt,
    oneTimeOnly: true
  };
}

export function isRelicActive(input: {
  relic: PhantomRelic;
  now: number;
}): boolean {
  return (
    input.now >= input.relic.startsAt &&
    input.now <= input.relic.expiresAt &&
    input.relic.claimedCount < input.relic.claimLimit
  );
}
