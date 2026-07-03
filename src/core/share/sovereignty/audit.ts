import type { RightsAuditLog, SovereigntyDecision } from "./types";

export function createRightsAuditLog(params: {
  objectId: string;
  actorId: string;
  decision: SovereigntyDecision;
}): RightsAuditLog {
  return {
    id: `rights_audit_${params.objectId}_${params.actorId}_${Date.now()}`,
    objectId: params.objectId,
    actorId: params.actorId,
    decision: params.decision,
    at: new Date().toISOString(),
  };
}

export function summarizeRightsAudit(logs: RightsAuditLog[]) {
  return {
    total: logs.length,
    allowed: logs.filter((log) => log.decision.allowed).length,
    denied: logs.filter((log) => !log.decision.allowed).length,
  };
}
