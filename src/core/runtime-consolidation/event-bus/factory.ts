import type { RuntimeDomain } from "../domainRegistry";
import type { LumoraEventEnvelope, LumoraEventKind } from "./types";
import { createLumoraEventId } from "./id";

const KIND_TO_DOMAIN: Record<LumoraEventKind, RuntimeDomain> = {
  "fyp.view": "fyp",
  "fyp.replay": "fyp",
  "feed.assembled": "feed",
  "creator.whisper": "creator_alchemy",
  "creator.quiet_gift": "creator_alchemy",
  "live.room_event": "live",
  "wallet.ledger_entry": "wallet",
  "trust.review": "trust_safety",
  "commerce.order": "commerce",
  "telemetry.metric": "infra_telemetry"
};

export function createLumoraEvent<TPayload extends Record<string, unknown>>(input: {
  kind: LumoraEventKind;
  actorId: string;
  targetId?: string;
  payload: TPayload;
  source: string;
  occurredAt?: string;
  replaySafe?: boolean;
}): LumoraEventEnvelope<TPayload> {
  const occurredAt = input.occurredAt ?? new Date().toISOString();

  return {
    eventId: createLumoraEventId(input.kind, input.actorId, occurredAt),
    kind: input.kind,
    domain: KIND_TO_DOMAIN[input.kind],
    actorId: input.actorId,
    ...(input.targetId ? { targetId: input.targetId } : {}),
    occurredAt,
    replaySafe: input.replaySafe ?? true,
    payload: input.payload,
    meta: {
      source: input.source,
      schemaVersion: "1.0"
    }
  };
}
