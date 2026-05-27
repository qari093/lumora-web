import type { RealtimeEventContract } from "./types";

export const REALTIME_EVENT_CONTRACTS: RealtimeEventContract[] = [
  {
    domain: "fyp",
    eventName: "fyp.watch",
    requiresIdempotencyKey: true,
    requiresTimestamp: true,
    requiresActorId: true,
    requiresReplaySafeId: true,
    requiresModerationGate: false,
    requiresTelemetry: true
  },
  {
    domain: "live",
    eventName: "live.room.event",
    requiresIdempotencyKey: true,
    requiresTimestamp: true,
    requiresActorId: true,
    requiresReplaySafeId: true,
    requiresModerationGate: true,
    requiresTelemetry: true
  },
  {
    domain: "creator_alchemy",
    eventName: "creator.quiet_gift",
    requiresIdempotencyKey: true,
    requiresTimestamp: true,
    requiresActorId: true,
    requiresReplaySafeId: true,
    requiresModerationGate: true,
    requiresTelemetry: true
  },
  {
    domain: "gmar",
    eventName: "gmar.match.event",
    requiresIdempotencyKey: true,
    requiresTimestamp: true,
    requiresActorId: true,
    requiresReplaySafeId: true,
    requiresModerationGate: true,
    requiresTelemetry: true
  },
  {
    domain: "wallet",
    eventName: "wallet.ledger.entry",
    requiresIdempotencyKey: true,
    requiresTimestamp: true,
    requiresActorId: true,
    requiresReplaySafeId: true,
    requiresModerationGate: false,
    requiresTelemetry: true
  },
  {
    domain: "share",
    eventName: "share.link.created",
    requiresIdempotencyKey: true,
    requiresTimestamp: true,
    requiresActorId: true,
    requiresReplaySafeId: true,
    requiresModerationGate: true,
    requiresTelemetry: true
  },
  {
    domain: "trust_safety",
    eventName: "trust.review.queued",
    requiresIdempotencyKey: true,
    requiresTimestamp: true,
    requiresActorId: true,
    requiresReplaySafeId: true,
    requiresModerationGate: true,
    requiresTelemetry: true
  }
];
