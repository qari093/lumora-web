export type ManualReviewItem = {
  id: string;
  reason: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
};

const queue: ManualReviewItem[] = [];

export function readManualReviewItems(): ManualReviewItem[] {
  return [...queue];
}

export function listManualReviewItems(): ManualReviewItem[] {
  return readManualReviewItems();
}

export function enqueueManualReview(item: Partial<ManualReviewItem> & { reason?: string } = {}): ManualReviewItem {
  const entry: ManualReviewItem = {
    id: item.id ?? `review_${Date.now()}`,
    reason: item.reason ?? "manual_review",
    severity: item.severity ?? "medium",
    createdAt: item.createdAt ?? new Date().toISOString(),
  };
  queue.push(entry);
  return entry;
}
