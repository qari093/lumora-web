export type ReviewQueueItem = {
  id: string;
  contentId: string;
  reason: string;
  priority: "low" | "medium" | "high";
  source: "surge" | "risk_mode" | "moderation";
  ts: number;
};

export function createReviewQueueItem(input: {
  contentId: string;
  reason: string;
  priority?: "low" | "medium" | "high";
  source?: "surge" | "risk_mode" | "moderation";
}): ReviewQueueItem {
  return {
    id: `rq_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    contentId: input.contentId,
    reason: input.reason,
    priority: input.priority ?? "medium",
    source: input.source ?? "surge",
    ts: Date.now(),
  };
}
