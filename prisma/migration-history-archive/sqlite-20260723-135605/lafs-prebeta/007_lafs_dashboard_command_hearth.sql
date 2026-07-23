CREATE TABLE IF NOT EXISTS lafs_dashboard_snapshots (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  state TEXT NOT NULL,
  lens_default TEXT NOT NULL DEFAULT 'OFF',
  payment_live_mode BOOLEAN NOT NULL DEFAULT FALSE,
  panels_json TEXT NOT NULL,
  guards_json TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lafs_dashboard_state_valid CHECK (state IN ('SAFE','WATCH','REVIEW','FROZEN')),
  CONSTRAINT lafs_dashboard_lens_valid CHECK (lens_default IN ('OFF','ON')),
  CONSTRAINT lafs_dashboard_payment_live_false CHECK (payment_live_mode = FALSE)
);

CREATE TABLE IF NOT EXISTS lafs_dashboard_operator_views (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  view_name TEXT NOT NULL,
  read_only BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lafs_dashboard_read_only CHECK (read_only = TRUE)
);
