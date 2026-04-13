export type EloInput = {
  requesterId: string;
  requesterElo: number;
  candidates: Array<{
    creatorId: string;
    elo: number;
  }>;
  maxGap?: number;
};

export type EloMatchResult = {
  found: boolean;
  match: {
    creatorId: string;
    elo: number;
    gap: number;
  } | null;
};

export function findEloMatch(input: EloInput): EloMatchResult {
  const requesterElo = Number.isFinite(input.requesterElo) ? input.requesterElo : 1000;
  const maxGap = Math.max(50, input.maxGap ?? 200);

  const valid = (input.candidates || [])
    .filter((c) => c && typeof c.creatorId === "string" && c.creatorId !== input.requesterId && Number.isFinite(c.elo))
    .map((c) => ({
      creatorId: c.creatorId,
      elo: c.elo,
      gap: Math.abs(c.elo - requesterElo),
    }))
    .filter((c) => c.gap <= maxGap)
    .sort((a, b) => a.gap - b.gap || a.creatorId.localeCompare(b.creatorId));

  if (valid.length === 0) {
    return { found: false, match: null };
  }

  return {
    found: true,
    match: valid[0],
  };
}
