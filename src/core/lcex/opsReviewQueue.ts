export type OpsReviewQueuePriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type OpsReviewQueueSource =
  | "trust-feedback"
  | "system-health"
  | "rights-gate"
  | "live-room"
  | "versus"
  | "prediction-pick"
  | "mood-board"
  | "identity"
  | "habit";

export type OpsReviewQueueItem = {
  id: string;
  source: OpsReviewQueueSource;
  sourceId: string;
  priority: OpsReviewQueuePriority;
  title: string;
  status: "open" | "assigned" | "resolved" | "dismissed";
  createdAt: string;
  assignedTo?: string;
};

export const OPS_REVIEW_QUEUE: OpsReviewQueueItem[] = [];

export function enqueueOpsReview(
  item: OpsReviewQueueItem
): void {
  OPS_REVIEW_QUEUE.push({
    ...item,
    id: item.id.trim(),
    sourceId: item.sourceId.trim(),
    title: item.title.trim(),
    assignedTo: item.assignedTo?.trim(),
  });
}

export function getOpsReviewById(
  id: string
): OpsReviewQueueItem | undefined {
  const normalizedId = id.trim();
  return OPS_REVIEW_QUEUE.find((item) => item.id === normalizedId);
}

export function getOpenOpsReviews(): OpsReviewQueueItem[] {
  const rank: Record<OpsReviewQueuePriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return OPS_REVIEW_QUEUE
    .filter((item) => item.status === "open" || item.status === "assigned")
    .sort((a, b) => {
      const priorityDelta = rank[a.priority] - rank[b.priority];
      if (priorityDelta !== 0) return priorityDelta;

      const aTs = Date.parse(a.createdAt);
      const bTs = Date.parse(b.createdAt);
      return (Number.isNaN(aTs) ? 0 : aTs) - (Number.isNaN(bTs) ? 0 : bTs);
    });
}
