import type { CreatorAlchemyEvent } from "@/src/core/creator-alchemy/live";

export interface AnalyticsSourceSnapshot {
  source: string;
  events: CreatorAlchemyEvent[];
  healthy: boolean;
}

export function createAnalyticsSourceSnapshot(
  source: string,
  events: CreatorAlchemyEvent[]
): AnalyticsSourceSnapshot {
  return {
    source,
    events,
    healthy: events.length >= 0
  };
}

export function mergeAnalyticsSnapshots(
  snapshots: readonly AnalyticsSourceSnapshot[]
): CreatorAlchemyEvent[] {
  return snapshots.flatMap((snapshot) => snapshot.events);
}
