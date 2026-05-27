export type AuditEvent = {
  action: string;
  ts: number;
};

export function createAuditEvent(action: string): AuditEvent {
  return {
    action,
    ts: Date.now()
  };
}
