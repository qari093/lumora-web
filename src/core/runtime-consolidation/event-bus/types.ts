import type { RuntimeDomain } from "../domainRegistry";

export type LumoraEventKind =
  | "fyp.view"
  | "fyp.replay"
  | "feed.assembled"
  | "creator.whisper"
  | "creator.quiet_gift"
  | "live.room_event"
  | "wallet.ledger_entry"
  | "trust.review"
  | "commerce.order"
  | "telemetry.metric";

export interface LumoraEventEnvelope<TPayload = Record<string, unknown>> {
  eventId: string;
  kind: LumoraEventKind;
  domain: RuntimeDomain;
  actorId: string;
  targetId?: string;
  occurredAt: string;
  replaySafe: boolean;
  payload: TPayload;
  meta: {
    source: string;
    schemaVersion: "1.0";
  };
}

export interface EventValidationResult {
  ok: boolean;
  error?: string;
}
