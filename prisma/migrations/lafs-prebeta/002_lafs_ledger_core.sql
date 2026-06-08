CREATE TABLE IF NOT EXISTS lafs_ledger_transactions (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT UNIQUE NOT NULL,
  source_reference TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_approval',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lafs_ledger_entries (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  account_code TEXT NOT NULL,
  amount_minor BIGINT NOT NULL,
  entry_type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES lafs_ledger_transactions(id),
  CONSTRAINT lafs_entry_amount_positive CHECK (amount_minor > 0),
  CONSTRAINT lafs_entry_type_valid CHECK (entry_type IN ('debit','credit'))
);

CREATE UNIQUE INDEX IF NOT EXISTS lafs_ledger_transactions_idempotency_idx
ON lafs_ledger_transactions(idempotency_key);

CREATE INDEX IF NOT EXISTS lafs_ledger_entries_transaction_idx
ON lafs_ledger_entries(transaction_id);

CREATE INDEX IF NOT EXISTS lafs_ledger_entries_account_idx
ON lafs_ledger_entries(account_code);
