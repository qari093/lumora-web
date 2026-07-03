import type { TrustAuditEntry, TrustDecision } from "./types";

export function createTrustAuditEntry(params: {
  actorId: string;
  objectId: string;
  decision: TrustDecision;
  reason: string;
}): TrustAuditEntry {
  return {
    id: `trust_audit_${params.objectId}_${params.actorId}_${Date.now()}`,
    actorId: params.actorId,
    objectId: params.objectId,
    decision: params.decision,
    reason: params.reason,
    at: new Date().toISOString(),
  };
}

export function summarizeTrustAudit(entries: TrustAuditEntry[]) {
  return {
    total: entries.length,
    allowed: entries.filter((entry) => entry.decision === "allow").length,
    limited: entries.filter((entry) => entry.decision === "limit").length,
    blocked: entries.filter((entry) => entry.decision === "block").length,
    review: entries.filter((entry) => entry.decision === "review").length,
  };
}
