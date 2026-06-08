CREATE TABLE IF NOT EXISTS lafs_stripe_events (
  id TEXT PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  raw_body TEXT NOT NULL,
  signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  idempotency_key TEXT UNIQUE NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lafs_payment_intents (
  id TEXT PRIMARY KEY,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_event_id TEXT NOT NULL,
  amount_minor BIGINT NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_approval',
  idempotency_key TEXT UNIQUE NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lafs_payment_amount_positive CHECK (amount_minor > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS lafs_stripe_events_event_id_idx
ON lafs_stripe_events(stripe_event_id);

CREATE UNIQUE INDEX IF NOT EXISTS lafs_payment_intents_idempotency_idx
ON lafs_payment_intents(idempotency_key);
