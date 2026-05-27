import type { RealtimeEventCapability } from "./types";

export const REALTIME_EVENT_CAPABILITIES: RealtimeEventCapability[] = [
  {
    domain: "fyp",
    eventName: "fyp.watch",
    hasIdempotencyKey: true,
    hasTimestamp: true,
    hasActorId: true,
    hasReplaySafeId: true,
    hasModerationGate: false,
    hasTelemetry: true
  },
  {
    domain: "live",
    eventName: "live.room.event",
    hasIdempotencyKey: true,
    hasTimestamp: true,
    hasActorId: true,
    hasReplaySafeId: true,
    hasModerationGate: true,
    hasTelemetry: true
  },
  {
    domain: "creator_alchemy",
    eventName: "creator.quiet_gift",
    hasIdempotencyKey: true,
    hasTimestamp: true,
    hasActorId: true,
    hasReplaySafeId: true,
    hasModerationGate: true,
    hasTelemetry: true
  },
  {
    domain: "gmar",
    eventName: "gmar.match.event",
    hasIdempotencyKey: true,
    hasTimestamp: true,
    hasActorId: true,
    hasReplaySafeId: false,
    hasModerationGate: true,
    hasTelemetry: true
  },
  {
    domain: "wallet",
    eventName: "wallet.ledger.entry",
    hasIdempotencyKey: true,
    hasTimestamp: true,
    hasActorId: true,
    hasReplaySafeId: true,
    hasModerationGate: false,
    hasTelemetry: true
  },
  {
    domain: "share",
    eventName: "share.link.created",
    hasIdempotencyKey: true,
    hasTimestamp: true,
    hasActorId: true,
    hasReplaySafeId: true,
    hasModerationGate: true,
    hasTelemetry: true
  },
  {
    domain: "trust_safety",
    eventName: "trust.review.queued",
    hasIdempotencyKey: true,
    hasTimestamp: true,
    hasActorId: true,
    hasReplaySafeId: true,
    hasModerationGate: true,
    hasTelemetry: true
  }
];

export function getRealtimeCapability(domain: string, eventName: string): RealtimeEventCapability | null {
  return REALTIME_EVENT_CAPABILITIES.find(
    (item) => item.domain === domain && item.eventName === eventName
  ) ?? null;
}
