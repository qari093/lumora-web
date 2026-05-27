import type { RealtimeRuntime } from "../types";
import { createPresenceSession } from "../presence/presenceSession";

export function runRealtimeCivilizationRuntime(): RealtimeRuntime {
  return {
    active: true,
    sessions: [
      createPresenceSession("user_001"),
      createPresenceSession("user_002")
    ]
  };
}
