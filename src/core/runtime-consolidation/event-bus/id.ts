export function createLumoraEventId(kind: string, actorId: string, occurredAt = new Date().toISOString()): string {
  const safeKind = kind.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const safeActor = actorId.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const random = Math.random().toString(36).slice(2, 10);
  return `evt_${safeKind}_${safeActor}_${Date.parse(occurredAt).toString(36)}_${random}`;
}
