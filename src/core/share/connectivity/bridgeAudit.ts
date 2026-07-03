import type { ExternalBridgeAction } from "./platformTypes";

export function createExternalBridgeAudit(action: ExternalBridgeAction, decision: "allow" | "limit" | "block") {
  return {
    id: `bridge_audit_${action.payload.shareId}_${action.platform}`,
    shareId: action.payload.shareId,
    platform: action.platform,
    decision,
    method: action.method,
    at: new Date().toISOString(),
  };
}
