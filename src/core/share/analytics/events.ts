import type { ShareAnalyticsEvent, ShareAnalyticsEventKind } from "./types";

export function createShareAnalyticsEvent(params: {
  shareId: string;
  actorId: string;
  kind: ShareAnalyticsEventKind;
  portal: string;
  mood?: string;
  weight?: number;
}): ShareAnalyticsEvent {
  return {
    id: `share_event_${params.shareId}_${params.kind}_${params.actorId}_${Date.now()}`,
    shareId: params.shareId,
    actorId: params.actorId,
    kind: params.kind,
    portal: params.portal,
    mood: params.mood,
    timestamp: new Date().toISOString(),
    weight: params.weight ?? 1,
  };
}

export function aggregateShareEvents(events: ShareAnalyticsEvent[]) {
  const byKind = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.kind] = (acc[event.kind] ?? 0) + 1;
    return acc;
  }, {});

  const byPortal = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.portal] = (acc[event.portal] ?? 0) + 1;
    return acc;
  }, {});

  const weightedTotal = Number(events.reduce((sum, event) => sum + event.weight, 0).toFixed(4));

  return {
    total: events.length,
    byKind,
    byPortal,
    weightedTotal,
  };
}
