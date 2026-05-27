export type SessionFeedbackEvent = {
  clipId: string;
  query?: string;
  category?: string;
  action: "watch" | "skip" | "like";
  dwellMs?: number;
};

export function trackDwellTime(events: SessionFeedbackEvent[]) {
  return events.reduce((sum, event) => sum + Number(event.dwellMs || 0), 0);
}

export function trackSkipRate(events: SessionFeedbackEvent[]) {
  if (!events.length) return 0;
  return events.filter((event) => event.action === "skip").length / events.length;
}

export function trackSessionPreferences(events: SessionFeedbackEvent[]) {
  const counts = new Map<string, number>();

  for (const event of events) {
    const key = event.query || event.category || "unknown";
    const weight = event.action === "like" ? 3 : event.action === "watch" ? 2 : -1;
    counts.set(key, (counts.get(key) || 0) + weight);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key, score]) => ({ key, score }));
}

export function adjustFeedBiasWithinSession(feed: any[], preferences: Array<{ key: string; score: number }>) {
  const preferred = new Set(preferences.filter((p) => p.score > 0).map((p) => p.key));

  return [...feed].sort((a, b) => {
    const aMatch = preferred.has(a.query) || preferred.has(a.category);
    const bMatch = preferred.has(b.query) || preferred.has(b.category);
    return Number(bMatch) - Number(aMatch);
  });
}

export function buildLightweightSessionFeedback(feed: any[], events: SessionFeedbackEvent[]) {
  const preferences = trackSessionPreferences(events);

  return {
    dwellMs: trackDwellTime(events),
    skipRate: trackSkipRate(events),
    preferences,
    feed: adjustFeedBiasWithinSession(feed, preferences),
    longTermProfiling: false,
  };
}
