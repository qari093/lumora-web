import type {
  AnalyticsEnvelope,
  AnalyticsEvent
} from "../types";

import { validateAnalyticsEvent } from "../contracts/analyticsContract";
import { AnalyticsStore } from "./analyticsStore";

export class FypAnalyticsRuntime {
  private readonly store = new AnalyticsStore();

  track(event: AnalyticsEvent): AnalyticsEnvelope {
    if (!validateAnalyticsEvent(event)) {
      throw new Error("invalid_analytics_event");
    }

    this.store.push(event);

    return {
      ok: true,
      event,
      snapshot: this.store.snapshot()
    };
  }

  snapshot() {
    return this.store.snapshot();
  }

  events() {
    return this.store.all();
  }
}

export function createFypAnalyticsRuntime() {
  return new FypAnalyticsRuntime();
}
