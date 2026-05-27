import type { PresenceSession, SyncEvent, RealtimeRuntime } from "../types";

export function validatePresenceSession(session: PresenceSession): boolean {
  return Boolean(session.id && session.userId && session.status);
}

export function validateSyncEvent(event: SyncEvent): boolean {
  return Boolean(event.id && event.type && event.payloadVersion > 0);
}

export function validateRealtimeRuntime(runtime: RealtimeRuntime): boolean {
  return Boolean(runtime.active === true && runtime.sessions.every(validatePresenceSession));
}
