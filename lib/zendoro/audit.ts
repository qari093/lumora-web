export function createAuditEvent(action: string) {
  return {
    action,
    createdAt: Date.now()
  };
}
