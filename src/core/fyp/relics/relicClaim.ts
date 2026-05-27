import type {
  PhantomRelic,
  RelicClaim
} from "./types";

import { isRelicActive } from "./relicEngine";

export function claimPhantomRelic(input: {
  relic: PhantomRelic;
  userId: string;
  now: number;
  alreadyClaimedRelicIds?: string[];
}): {
  relic: PhantomRelic;
  claim: RelicClaim;
} {
  if (!input.userId.trim()) {
    throw new Error("Relic claim requires userId.");
  }

  if ((input.alreadyClaimedRelicIds ?? []).includes(input.relic.relicId)) {
    throw new Error("Phantom relic already claimed by user.");
  }

  if (!isRelicActive({ relic: input.relic, now: input.now })) {
    throw new Error("Phantom relic is not active.");
  }

  const claim: RelicClaim = {
    claimId: `claim_${input.relic.relicId}_${input.userId}_${input.now}`,
    relicId: input.relic.relicId,
    userId: input.userId,
    claimedAt: input.now,
    valid: true
  };

  return {
    relic: {
      ...input.relic,
      claimedCount: input.relic.claimedCount + 1
    },
    claim
  };
}
