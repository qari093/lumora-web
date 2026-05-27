export interface PersistenceAdapterCapabilities {
  target: string;
  persistentWrite: boolean;
  idempotency: boolean;
  rollback: boolean;
  recovery: boolean;
  snapshot: boolean;
  replay: boolean;
  fallback: boolean;
}

export const LAUNCH_PERSISTENCE_CAPABILITIES: PersistenceAdapterCapabilities[] = [
  {
    target: "creator_alchemy_events",
    persistentWrite: true,
    idempotency: true,
    rollback: false,
    recovery: true,
    snapshot: true,
    replay: true,
    fallback: true
  },
  {
    target: "creator_quiet_gifts",
    persistentWrite: true,
    idempotency: true,
    rollback: true,
    recovery: true,
    snapshot: true,
    replay: true,
    fallback: true
  },
  {
    target: "wallet_ledger",
    persistentWrite: true,
    idempotency: true,
    rollback: true,
    recovery: true,
    snapshot: true,
    replay: true,
    fallback: true
  },
  {
    target: "commerce_orders",
    persistentWrite: false,
    idempotency: false,
    rollback: false,
    recovery: false,
    snapshot: false,
    replay: false,
    fallback: true
  },
  {
    target: "media_uploads",
    persistentWrite: true,
    idempotency: true,
    rollback: false,
    recovery: true,
    snapshot: true,
    replay: false,
    fallback: true
  },
  {
    target: "fyp_events",
    persistentWrite: true,
    idempotency: true,
    rollback: false,
    recovery: true,
    snapshot: true,
    replay: true,
    fallback: true
  },
  {
    target: "live_room_state",
    persistentWrite: true,
    idempotency: true,
    rollback: false,
    recovery: true,
    snapshot: true,
    replay: true,
    fallback: true
  },
  {
    target: "gmar_game_state",
    persistentWrite: true,
    idempotency: true,
    rollback: true,
    recovery: true,
    snapshot: true,
    replay: true,
    fallback: true
  },
  {
    target: "trust_moderation_queue",
    persistentWrite: true,
    idempotency: true,
    rollback: false,
    recovery: true,
    snapshot: true,
    replay: true,
    fallback: true
  },
  {
    target: "telemetry_events",
    persistentWrite: true,
    idempotency: false,
    rollback: false,
    recovery: true,
    snapshot: true,
    replay: true,
    fallback: true
  }
];

export function getPersistenceCapabilities(target: string): PersistenceAdapterCapabilities | null {
  return LAUNCH_PERSISTENCE_CAPABILITIES.find((item) => item.target === target) ?? null;
}
