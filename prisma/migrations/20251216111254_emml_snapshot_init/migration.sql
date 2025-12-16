-- EMML Snapshot table for tests / baseline persistence
CREATE TABLE IF NOT EXISTS "emml_snapshot" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "composite" JSON NOT NULL,
  "indicesJson" JSON NOT NULL,
  "marketsJson" JSON NOT NULL,
  "metaJson" JSON NOT NULL
);
