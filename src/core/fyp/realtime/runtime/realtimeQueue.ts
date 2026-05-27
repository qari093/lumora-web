import type { RealtimeEvent, RealtimeState } from "../types";
import { validateRealtimeEvent } from "../contracts/realtimeContract";

export class FypRealtimeQueue {
  private queue: RealtimeEvent[] = [];
  private deliveredCount = 0;

  enqueue(event: RealtimeEvent): RealtimeState {
    if (!validateRealtimeEvent(event)) {
      throw new Error("invalid_realtime_event");
    }

    this.queue.push(event);

    return this.state();
  }

  flush(): RealtimeEvent[] {
    const items = [...this.queue];
    this.queue = [];
    this.deliveredCount += items.length;
    return items;
  }

  state(): RealtimeState {
    return {
      connected: true,
      queued: this.queue.length,
      delivered: this.deliveredCount
    };
  }
}
