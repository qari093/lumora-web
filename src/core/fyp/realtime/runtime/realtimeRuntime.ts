import type { RealtimeEvent, RealtimeState } from "../types";
import { FypRealtimeQueue } from "./realtimeQueue";
import { createRealtimeEnvelope } from "./realtimeEnvelope";

export class FypRealtimeRuntime {
  private readonly queue = new FypRealtimeQueue();

  publish(event: RealtimeEvent) {
    this.queue.enqueue(event);
    return createRealtimeEnvelope(event);
  }

  flush(): RealtimeEvent[] {
    return this.queue.flush();
  }

  state(): RealtimeState {
    return this.queue.state();
  }
}

export function createFypRealtimeRuntime(): FypRealtimeRuntime {
  return new FypRealtimeRuntime();
}
