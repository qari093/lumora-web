-- CreateTable
CREATE TABLE "ReflectionJournal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "title" TEXT,
    "text" TEXT NOT NULL,
    "mood" TEXT,
    "tags" JSONB,
    "score" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReflectionJournal_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
