import type {
  ActivatedFeed,
  RealFeedCandidate
} from "../real-feed/types";

import {
  buildRealFeedCandidates
} from "../real-feed/candidatePipeline";

import {
  rankRealFeedCandidates
} from "../ranking/rankingPipeline";

import {
  balanceFeedDiversity
} from "../ranking/diversityBalancer";

export function activateRealFeed(input: {
  userId: string;
  mode: string;
  candidates: RealFeedCandidate[];
  limit?: number;
}): ActivatedFeed {
  if (!input.userId.trim()) {
    throw new Error("Real feed activation requires userId.");
  }

  const safeCandidates = buildRealFeedCandidates(input.candidates);

  const ranked =
    balanceFeedDiversity(
      rankRealFeedCandidates(safeCandidates)
    ).slice(0, input.limit ?? 20);

  return {
    userId: input.userId,
    mode: input.mode,
    items: ranked,
    activated: ranked.length > 0,
    safe: ranked.every(item => item.safetyScore >= 70)
  };
}
