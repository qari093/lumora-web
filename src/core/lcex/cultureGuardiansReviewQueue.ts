export type CultureGuardianPriority =
  | "normal"
  | "high"
  | "critical";

export type CultureGuardianQueueStatus =
  | "pending"
  | "assigned"
  | "reviewed"
  | "escalated"
  | "closed";

export type CultureGuardianReviewItem = {
  id: string;
  entityId: string;
  title: string;
  region?: string;
  language?: string;
  culturalScore: number;
  sensitivityScore: number;
  priority: CultureGuardianPriority;
  status: CultureGuardianQueueStatus;
  reasons: string[];
  createdAt: string;
  assignedTo?: string;
};

export const CULTURE_GUARDIANS_REVIEW_QUEUE: CultureGuardianReviewItem[] = [];

export function enqueueCultureGuardianReview(
  item: CultureGuardianReviewItem
): void {
  CULTURE_GUARDIANS_REVIEW_QUEUE.push(item);
}

export function getPendingCultureGuardianReviews(): CultureGuardianReviewItem[] {
  return [...CULTURE_GUARDIANS_REVIEW_QUEUE]
    .filter((item) => item.status === "pending" || item.status === "assigned")
    .sort((a, b) => {
      const priorityRank: Record<CultureGuardianPriority, number> = {
        critical: 0,
        high: 1,
        normal: 2,
      };

      const priorityDelta = priorityRank[a.priority] - priorityRank[b.priority];
      if (priorityDelta !== 0) return priorityDelta;

      return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });
}

export function assignCultureGuardianReview(
  id: string,
  reviewer: string
): CultureGuardianReviewItem | undefined {
  const item = CULTURE_GUARDIANS_REVIEW_QUEUE.find((entry) => entry.id === id);
  if (!item) return undefined;

  item.assignedTo = reviewer.trim();
  item.status = "assigned";
  return item;
}
