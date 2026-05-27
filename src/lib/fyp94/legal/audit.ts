import type { Fyp94LegalAuditEvent } from "./types";

export function createFyp94LegalAuditEvent(
  input: Omit<Fyp94LegalAuditEvent, "at">,
): Fyp94LegalAuditEvent {
  return {
    ...input,
    at: new Date().toISOString(),
  };
}

export function appendFyp94LegalAuditEvent(
  events: Fyp94LegalAuditEvent[],
  event: Fyp94LegalAuditEvent,
): Fyp94LegalAuditEvent[] {
  return [...events, event];
}
