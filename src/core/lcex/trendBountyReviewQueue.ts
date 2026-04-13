export type TrendBountyReviewPriority =
  | "normal"
  | "high"
  | "critical";

export type TrendBountyReviewStatus =
  | "pending"
  | "assigned"
  | "reviewed"
  | "approved"
  | "rejected"
  | "escalated";

export type TrendBountyReviewItem = {
  id: string;
  bountyId: string;
  submissionId: string;
  userId: string;
  title: string;
  priority: TrendBountyReviewPriority;
  status: TrendBountyReviewStatus;
  score: number;
  reasons: string[];
  createdAt: string;
  assignedTo?: string;
};

export const TREND_BOUNTY_REVIEW_QUEUE: TrendBountyReviewItem[] = [];

export function enqueueTrendBountyReview(
  item: TrendBountyReviewItem
): void {
  TREND_BOUNTY_REVIEW_QUEUE.push({
    ...item,
    id: item.id.trim(),
    bountyId: item.bountyId.trim(),
    submissionId: item.submissionId.trim(),
    userId: item.userId.trim(),
    title: item.title.trim(),
    reasons: item.reasons.map((r) => r.trim()).filter(Boolean),
  });
}

export function getPendingTrendBountyReviews(): TrendBountyReviewItem[] {
  return [...TREND_BOUNTY_REVIEW_QUEUE]
    .filter((item) => item.status === "pending" || item.status === "assigned")
    .sort((a, b) => {
      const priorityRank: Record<TrendBountyReviewPriority, number> = {
        critical: 0,
        high: 1,
        normal: 2,
      };

      const priorityDelta = priorityRank[a.priority] - priorityRank[b.priority];
      if (priorityDelta !== 0) return priorityDelta;
      return b.score - a.score;
    });
}

export function assignTrendBountyReview(
  id: string,
  reviewer: string
): TrendBountyReviewItem | undefined {
  const item = TREND_BOUNTY_REVIEW_QUEUE.find((entry) => entry.id === id.trim());
  if (!item) return undefined;

  item.assignedTo = reviewer.trim();
  item.status = "assigned";
  return item;
}
