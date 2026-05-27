import type { RelicClaim } from "./types";

export type RelicInventory = {
  userId: string;
  claims: RelicClaim[];
  totalRelics: number;
};

export function createRelicInventory(input: {
  userId: string;
  claims: RelicClaim[];
}): RelicInventory {
  if (!input.userId.trim()) {
    throw new Error("Relic inventory requires userId.");
  }

  return {
    userId: input.userId,
    claims: input.claims.filter(claim => claim.valid),
    totalRelics: input.claims.filter(claim => claim.valid).length
  };
}
