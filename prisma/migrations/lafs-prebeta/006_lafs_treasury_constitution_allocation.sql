CREATE TABLE IF NOT EXISTS lafs_treasury_allocation_rules (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  effective_from TIMESTAMP NOT NULL,
  operations_pct NUMERIC(5,2) NOT NULL,
  reserve_pct NUMERIC(5,2) NOT NULL,
  growth_pct NUMERIC(5,2) NOT NULL,
  creator_rewards_pct NUMERIC(5,2) NOT NULL,
  emergency_buffer_pct NUMERIC(5,2) NOT NULL,
  approved_by_json TEXT NOT NULL,
  superseded_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lafs_treasury_allocation_total_100 CHECK (
    operations_pct + reserve_pct + growth_pct + creator_rewards_pct + emergency_buffer_pct = 100.00
  )
);

CREATE TABLE IF NOT EXISTS lafs_financial_constitution_versions (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  constitution_json TEXT NOT NULL,
  diff_json TEXT NOT NULL DEFAULT '{}',
  council_vote_reference TEXT,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lafs_treasury_allocations (
  id TEXT PRIMARY KEY,
  source_transaction_id TEXT,
  allocation_rule_version INTEGER NOT NULL,
  total_amount_minor BIGINT NOT NULL,
  operations_minor BIGINT NOT NULL,
  reserve_minor BIGINT NOT NULL,
  growth_minor BIGINT NOT NULL,
  creator_rewards_minor BIGINT NOT NULL,
  emergency_buffer_minor BIGINT NOT NULL,
  remainder_minor BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lafs_treasury_allocation_amount_positive CHECK (total_amount_minor >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS lafs_treasury_allocation_active_version_idx
ON lafs_treasury_allocation_rules(version);

CREATE INDEX IF NOT EXISTS lafs_financial_constitution_active_idx
ON lafs_financial_constitution_versions(active);
