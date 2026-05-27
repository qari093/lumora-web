import type { PersistenceTarget } from "./types";

export const LAUNCH_PERSISTENCE_TARGETS: PersistenceTarget[] = [
  {
    name: "creator_alchemy_events",
    domain: "creator_alchemy",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: false,
    requiresRecovery: true
  },
  {
    name: "creator_quiet_gifts",
    domain: "creator_alchemy",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: true,
    requiresRecovery: true
  },
  {
    name: "wallet_ledger",
    domain: "wallet",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: true,
    requiresRecovery: true
  },
  {
    name: "commerce_orders",
    domain: "commerce",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: true,
    requiresRecovery: true
  },
  {
    name: "media_uploads",
    domain: "media",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: false,
    requiresRecovery: true
  },
  {
    name: "fyp_events",
    domain: "fyp",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: false,
    requiresRecovery: true
  },
  {
    name: "live_room_state",
    domain: "live",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: false,
    requiresRecovery: true
  },
  {
    name: "gmar_game_state",
    domain: "gmar",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: true,
    requiresRecovery: true
  },
  {
    name: "trust_moderation_queue",
    domain: "trust_safety",
    requiresPersistentWrite: true,
    requiresIdempotency: true,
    requiresRollback: false,
    requiresRecovery: true
  },
  {
    name: "telemetry_events",
    domain: "infra_telemetry",
    requiresPersistentWrite: true,
    requiresIdempotency: false,
    requiresRollback: false,
    requiresRecovery: true
  }
];
