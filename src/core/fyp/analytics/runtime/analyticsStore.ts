import type {
  AnalyticsEvent,
  AnalyticsSnapshot
} from "../types";

export class AnalyticsStore {
  private readonly events: AnalyticsEvent[] = [];

  push(event: AnalyticsEvent) {
    this.events.push(event);
  }

  all(): AnalyticsEvent[] {
    return [...this.events];
  }

  snapshot(): AnalyticsSnapshot {
    const users = new Set(this.events.map((e) => e.userId));
    const sessions = new Set(this.events.map((e) => e.sessionId));

    return {
      totalEvents: this.events.length,
      uniqueUsers: users.size,
      uniqueSessions: sessions.size,
      lastEventAt:
        this.events.length > 0
          ? this.events[this.events.length - 1].ts
          : null
    };
  }
}
