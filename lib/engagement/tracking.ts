export type EngagementEventType =
  | "view"
  | "like"
  | "skip"
  | "watch_progress"
  | "complete";

export type EngagementEvent = {
  itemId: string;
  userId: string;
  type: EngagementEventType;
  timestamp: number;
  watchMs?: number;
};

export type EngagementSummary = {
  itemId: string;
  views: number;
  likes: number;
  skips: number;
  completes: number;
  totalWatchMs: number;
  averageWatchMs: number;
  completionRate: number;
};

export function summarizeEngagement(
  itemId: string,
  events: EngagementEvent[]
): EngagementSummary {
  const filtered = events.filter((e) => e.itemId === itemId);

  const views = filtered.filter((e) => e.type === "view").length;
  const likes = filtered.filter((e) => e.type === "like").length;
  const skips = filtered.filter((e) => e.type === "skip").length;
  const completes = filtered.filter((e) => e.type === "complete").length;

  const totalWatchMs = filtered.reduce((sum, e) => {
    if (e.type === "watch_progress" || e.type === "complete") {
      return sum + Math.max(0, e.watchMs ?? 0);
    }
    return sum;
  }, 0);

  const watchCount = filtered.filter(
    (e) => e.type === "watch_progress" || e.type === "complete"
  ).length;

  const averageWatchMs = watchCount > 0 ? Math.round(totalWatchMs / watchCount) : 0;
  const completionRate = views > 0 ? Number((completes / views).toFixed(4)) : 0;

  return {
    itemId,
    views,
    likes,
    skips,
    completes,
    totalWatchMs,
    averageWatchMs,
    completionRate
  };
}

export function validateEngagementEvent(event: EngagementEvent): boolean {
  if (!event.itemId || !event.userId) return false;
  if (!Number.isFinite(event.timestamp) || event.timestamp <= 0) return false;
  if (
    event.type === "watch_progress" ||
    event.type === "complete"
  ) {
    if (!Number.isFinite(event.watchMs) || (event.watchMs ?? 0) < 0) return false;
  }
  return true;
}
