export type BlockStar = {
  creatorId: string;
  district: string;
  impactQuotient: number;
  crownedAt: number;
  expiresAt: number;
};

export function crownBlockStar(input: {
  creatorId: string;
  district: string;
  impactQuotient: number;
  now?: number;
}): BlockStar {
  if (!input.creatorId.trim() || !input.district.trim()) {
    throw new Error("Block Star requires creatorId and district.");
  }

  if (input.impactQuotient < 1) {
    throw new Error("Block Star impactQuotient invalid.");
  }

  const now = input.now ?? Date.now();

  return {
    creatorId: input.creatorId,
    district: input.district,
    impactQuotient: input.impactQuotient,
    crownedAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000
  };
}

export function isActiveBlockStar(input: {
  blockStar: BlockStar;
  now: number;
}): boolean {
  return input.now <= input.blockStar.expiresAt;
}
