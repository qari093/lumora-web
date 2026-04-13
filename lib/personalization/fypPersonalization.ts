export type UserSignal = {
  likedTags?: string[];
  blockedTags?: string[];
  preferredCreators?: string[];
};

export type FeedCandidate = {
  id: string;
  tags?: string[];
  creatorId?: string;
  baseScore: number;
};

export function personalizeFeed(
  candidates: FeedCandidate[],
  signal: UserSignal
): FeedCandidate[] {
  if (!Array.isArray(candidates) || candidates.length === 0) return [];

  const likedTags = new Set(signal.likedTags ?? []);
  const blockedTags = new Set(signal.blockedTags ?? []);
  const preferredCreators = new Set(signal.preferredCreators ?? []);

  const rescored = candidates.map((item) => {
    let score = item.baseScore;

    for (const tag of item.tags ?? []) {
      if (likedTags.has(tag)) score += 0.25;
      if (blockedTags.has(tag)) score -= 1.5;
    }

    if (item.creatorId && preferredCreators.has(item.creatorId)) {
      score += 0.35;
    }

    return {
      ...item,
      baseScore: score
    };
  });

  return rescored.sort((a, b) => b.baseScore - a.baseScore);
}
