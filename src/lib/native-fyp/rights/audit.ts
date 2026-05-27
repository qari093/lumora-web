export type RightsAuditEvent = {
  videoId: string;
  action:
    | "rights_declared"
    | "rights_verified"
    | "rights_rejected"
    | "rights_expired"
    | "native_fyp_blocked";
  reason?: string;
  at: string;
};

export function createRightsAuditEvent(input: Omit<RightsAuditEvent, "at">): RightsAuditEvent {
  return {
    ...input,
    at: new Date().toISOString(),
  };
}

export function appendRightsAuditEvent(
  history: RightsAuditEvent[],
  event: RightsAuditEvent,
): RightsAuditEvent[] {
  return [...history, event];
}
