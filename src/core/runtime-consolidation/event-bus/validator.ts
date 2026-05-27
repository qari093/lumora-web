import type { EventValidationResult, LumoraEventEnvelope } from "./types";

const VALID_KINDS = new Set([
  "fyp.view",
  "fyp.replay",
  "feed.assembled",
  "creator.whisper",
  "creator.quiet_gift",
  "live.room_event",
  "wallet.ledger_entry",
  "trust.review",
  "commerce.order",
  "telemetry.metric"
]);

export function validateLumoraEvent(event: unknown): EventValidationResult {
  if (!event || typeof event !== "object") return { ok: false, error: "event_must_be_object" };

  const value = event as Partial<LumoraEventEnvelope>;

  if (typeof value.eventId !== "string" || !value.eventId.startsWith("evt_")) return { ok: false, error: "invalid_event_id" };
  if (typeof value.kind !== "string" || !VALID_KINDS.has(value.kind)) return { ok: false, error: "invalid_event_kind" };
  if (typeof value.domain !== "string") return { ok: false, error: "invalid_domain" };
  if (typeof value.actorId !== "string" || value.actorId.trim().length === 0) return { ok: false, error: "invalid_actor" };
  if (typeof value.occurredAt !== "string" || Number.isNaN(Date.parse(value.occurredAt))) return { ok: false, error: "invalid_occurred_at" };
  if (typeof value.replaySafe !== "boolean") return { ok: false, error: "invalid_replay_safe" };
  if (!value.payload || typeof value.payload !== "object") return { ok: false, error: "invalid_payload" };
  if (!value.meta || value.meta.schemaVersion !== "1.0") return { ok: false, error: "invalid_schema_version" };

  return { ok: true };
}

export function assertLumoraEvent(event: unknown): asserts event is LumoraEventEnvelope {
  const result = validateLumoraEvent(event);
  if (!result.ok) throw new Error(result.error ?? "invalid_lumora_event");
}
