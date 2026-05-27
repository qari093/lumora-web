import type { RealtimeEnvelope, RealtimeEvent } from "../types";
import { validateRealtimeEvent } from "../contracts/realtimeContract";

export function createRealtimeEnvelope(event: RealtimeEvent): RealtimeEnvelope {
  if (!validateRealtimeEvent(event)) {
    throw new Error("invalid_realtime_event");
  }

  return {
    ok: true,
    channel: "fyp",
    event
  };
}
