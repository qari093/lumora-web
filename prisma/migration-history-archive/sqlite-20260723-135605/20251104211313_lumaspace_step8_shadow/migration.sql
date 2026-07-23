-- CreateTable
CREATE TABLE "ShadowJournal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShadowJournal_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShadowEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "journalId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "emotion" TEXT,
    "privacy" TEXT NOT NULL DEFAULT 'private',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShadowEntry_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "ShadowJournal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ShadowJournal_worldId_idx" ON "ShadowJournal"("worldId");

-- CreateIndex
CREATE INDEX "ShadowEntry_journalId_createdAt_idx" ON "ShadowEntry"("journalId", "createdAt");
