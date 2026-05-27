import type {
  RankedFeedItem,
  RealFeedCandidate
} from "../real-feed/types";

import {
  calculateRankScore
} from "./rankScore";

export function rankRealFeedCandidates(
  candidates: RealFeedCandidate[]
): RankedFeedItem[] {
  return [...candidates]
    .map(candidate => ({
      ...candidate,
      rankScore: calculateRankScore(candidate),
      rank: 0
    }))
    .sort((a, b) => b.rankScore - a.rankScore)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
}
