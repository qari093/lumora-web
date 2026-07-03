import type { UniversalShareObject } from "../foundation/types";

export type ShareTelemetryEvent = {
  type:
    | "share_created"
    | "share_validated"
    | "share_queued"
    | "share_delivering"
    | "share_delivered"
    | "share_failed"
    | "share_rolled_back"
    | "share_revoked";
  shareId: string;
  sourcePortal: UniversalShareObject["sourcePortal"];
  destinationPortal: UniversalShareObject["destinationPortal"];
  lifecycle: UniversalShareObject["lifecycle"];
  at: string;
};

export function createShareTelemetryEvent(
  type: ShareTelemetryEvent["type"],
  share: UniversalShareObject,
): ShareTelemetryEvent {
  return {
    type,
    shareId: share.id,
    sourcePortal: share.sourcePortal,
    destinationPortal: share.destinationPortal,
    lifecycle: share.lifecycle,
    at: new Date().toISOString(),
  };
}
