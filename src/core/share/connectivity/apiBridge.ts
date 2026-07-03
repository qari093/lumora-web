import type { ConnectivityPayload } from "./types";

export type ConnectivityApiEnvelope = {
  version: "usl-connectivity-api-v1";
  event: "share.deliver" | "share.preview" | "share.revoke" | "share.return";
  payload: ConnectivityPayload;
  idempotencyKey: string;
};

export function createConnectivityApiEnvelope(
  event: ConnectivityApiEnvelope["event"],
  payload: ConnectivityPayload,
): ConnectivityApiEnvelope {
  return {
    version: "usl-connectivity-api-v1",
    event,
    payload,
    idempotencyKey: `usl_${event}_${payload.shareId}_${payload.channel}`,
  };
}

export function validateConnectivityApiEnvelope(envelope: ConnectivityApiEnvelope): boolean {
  return (
    envelope.version === "usl-connectivity-api-v1" &&
    Boolean(envelope.payload.shareId) &&
    Boolean(envelope.idempotencyKey)
  );
}
