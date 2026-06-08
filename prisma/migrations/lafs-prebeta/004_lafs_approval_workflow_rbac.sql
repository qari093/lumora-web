CREATE TABLE IF NOT EXISTS lafs_approval_rules (
  id TEXT PRIMARY KEY,
  min_amount_minor BIGINT NOT NULL,
  max_amount_minor BIGINT,
  required_approvals INTEGER NOT NULL,
  required_council_approvals INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lafs_approval_rule_positive CHECK (min_amount_minor > 0),
  CONSTRAINT lafs_approval_rule_required_positive CHECK (required_approvals > 0),
  CONSTRAINT lafs_approval_rule_council_valid CHECK (required_council_approvals >= 0)
);

CREATE TABLE IF NOT EXISTS lafs_approval_requests (
  id TEXT PRIMARY KEY,
  transaction_id TEXT,
  amount_minor BIGINT NOT NULL,
  requestor_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'pending',
  required_approvals INTEGER NOT NULL,
  required_council_approvals INTEGER NOT NULL,
  deadline_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lafs_approval_state_valid CHECK (
    state IN ('pending','partially_approved','approved','rejected','expired')
  )
);

CREATE TABLE IF NOT EXISTS lafs_approval_decisions (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  approver_id TEXT NOT NULL,
  approver_role TEXT NOT NULL,
  approved BOOLEAN NOT NULL,
  reason TEXT,
  decided_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES lafs_approval_requests(id),
  CONSTRAINT lafs_approval_role_valid CHECK (approver_role IN ('operator','council'))
);

CREATE UNIQUE INDEX IF NOT EXISTS lafs_approval_one_decision_per_approver_idx
ON lafs_approval_decisions(request_id, approver_id);
