import type { ShareAnalyticsEvent } from "./types";

export function createJourneyGraph(events: ShareAnalyticsEvent[]) {
  return events
    .slice()
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
    .map((event, index) => ({
      step: index + 1,
      portal: event.portal,
      kind: event.kind,
      actorId: event.actorId,
      label: `${event.portal}:${event.kind}`,
    }));
}

export function detectShareTrend(events: ShareAnalyticsEvent[]) {
  const recentWeight = events.slice(-3).reduce((sum, event) => sum + event.weight, 0);
  const earlyWeight = events.slice(0, 3).reduce((sum, event) => sum + event.weight, 0);

  if (recentWeight > earlyWeight * 1.2) return "rising";
  if (recentWeight < earlyWeight * 0.75) return "cooling";
  return "stable";
}
