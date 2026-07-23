CREATE TABLE IF NOT EXISTS lafs_reconciliation_runs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  source_a_minor BIGINT NOT NULL,
  source_b_minor BIGINT NOT NULL,
  tolerance_minor BIGINT NOT NULL DEFAULT 0,
  delta_minor BIGINT NOT NULL,
  status TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  freeze_state TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lafs_reconciliation_source_valid CHECK (
    source IN ('stripe_vs_ledger','payout_vs_bank','zencoin_vs_chain','ledger_vs_custody')
  ),
  CONSTRAINT lafs_reconciliation_status_valid CHECK (status IN ('pass','fail')),
  CONSTRAINT lafs_reconciliation_risk_valid CHECK (risk_level IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  CONSTRAINT lafs_reconciliation_freeze_valid CHECK (freeze_state IN ('SAFE','WATCH','REVIEW','FROZEN'))
);

CREATE TABLE IF NOT EXISTS lafs_risk_flags (
  id TEXT PRIMARY KEY,
  reconciliation_run_id TEXT,
  severity TEXT NOT NULL,
  source TEXT NOT NULL,
  freeze_state TEXT NOT NULL,
  auto_freeze BOOLEAN NOT NULL DEFAULT FALSE,
  owner TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (reconciliation_run_id) REFERENCES lafs_reconciliation_runs(id),
  CONSTRAINT lafs_risk_flag_state_valid CHECK (state IN ('open','reviewing','resolved','rejected'))
);

CREATE TABLE IF NOT EXISTS lafs_freeze_events (
  id TEXT PRIMARY KEY,
  risk_flag_id TEXT,
  source TEXT NOT NULL,
  freeze_state TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'freeze',
  reason TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (risk_flag_id) REFERENCES lafs_risk_flags(id),
  CONSTRAINT lafs_freeze_event_type_valid CHECK (event_type IN ('freeze','unfreeze'))
);

CREATE TABLE IF NOT EXISTS lafs_unfreeze_requests (
  id TEXT PRIMARY KEY,
  freeze_event_id TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  evidence_json TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'pending',
  required_approvals INTEGER NOT NULL DEFAULT 2,
  approved_by_json TEXT NOT NULL DEFAULT '[]',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (freeze_event_id) REFERENCES lafs_freeze_events(id),
  CONSTRAINT lafs_unfreeze_state_valid CHECK (state IN ('pending','approved','rejected'))
);

CREATE INDEX IF NOT EXISTS lafs_reconciliation_runs_source_idx
ON lafs_reconciliation_runs(source);

CREATE INDEX IF NOT EXISTS lafs_risk_flags_state_idx
ON lafs_risk_flags(state);

CREATE INDEX IF NOT EXISTS lafs_freeze_events_source_idx
ON lafs_freeze_events(source);
